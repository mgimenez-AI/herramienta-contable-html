<#
.SYNOPSIS
  Crea las 3 Listas de SharePoint que usa la app "Gestión Contable"
  (Equipo, Proyectos, Tareas), con las columnas exactas descritas en SETUP.md.

.REQUISITOS
  1) Módulo PnP.PowerShell instalado:
       Install-Module PnP.PowerShell -Scope CurrentUser
  2) Correr este script DESDE la misma máquina donde tenés sesión abierta
     (o dejar que te pida login interactivo).

.USO
  Editá $siteUrl más abajo si hace falta, y ejecutá:
       .\create-sharepoint-lists.ps1
#>

param(
  [string]$siteUrl = "https://disacsp.sharepoint.com/diur/DIUR-A06-00005776"
)

Write-Host "Conectando a $siteUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $siteUrl -Interactive

function New-ListIfMissing {
  param([string]$Title)
  $existing = Get-PnPList -Identity $Title -ErrorAction SilentlyContinue
  if ($existing) {
    Write-Host "La lista '$Title' ya existe, se usa la existente." -ForegroundColor Yellow
  } else {
    New-PnPList -Title $Title -Template GenericList | Out-Null
    Write-Host "Lista '$Title' creada." -ForegroundColor Green
  }
}

function Add-FieldIfMissing {
  param([string]$List, [string]$InternalName, [string]$DisplayName, [string]$Type)
  $existing = Get-PnPField -List $List -Identity $InternalName -ErrorAction SilentlyContinue
  if ($existing) { return }
  Add-PnPField -List $List -DisplayName $DisplayName -InternalName $InternalName -Type $Type -AddToDefaultView | Out-Null
}

function Add-ChoiceFieldIfMissing {
  param([string]$List, [string]$InternalName, [string]$DisplayName, [string[]]$Choices)
  $existing = Get-PnPField -List $List -Identity $InternalName -ErrorAction SilentlyContinue
  if ($existing) { return }
  $choicesXml = ($Choices | ForEach-Object { "<CHOICE>$_</CHOICE>" }) -join ""
  $fieldXml = "<Field Type='Choice' DisplayName='$DisplayName' Name='$InternalName' Format='Dropdown'><CHOICES>$choicesXml</CHOICES></Field>"
  Add-PnPFieldFromXml -List $List -FieldXml $fieldXml | Out-Null
  Set-PnPField -List $List -Identity $InternalName -Values @{AddToDefaultView = $true} | Out-Null
}

function Add-LookupFieldIfMissing {
  param([string]$List, [string]$InternalName, [string]$DisplayName, [string]$TargetListTitle)
  $existing = Get-PnPField -List $List -Identity $InternalName -ErrorAction SilentlyContinue
  if ($existing) { return }
  $targetList = Get-PnPList -Identity $TargetListTitle
  $fieldXml = "<Field Type='Lookup' DisplayName='$DisplayName' Name='$InternalName' List='{$($targetList.Id)}' ShowField='Title' Required='FALSE' />"
  Add-PnPFieldFromXml -List $List -FieldXml $fieldXml | Out-Null
  Set-PnPField -List $List -Identity $InternalName -Values @{AddToDefaultView = $true} | Out-Null
}

# ---- 1) Equipo ----
New-ListIfMissing -Title "Equipo"
Add-FieldIfMissing -List "Equipo" -InternalName "Rol" -DisplayName "Rol" -Type Text
Add-FieldIfMissing -List "Equipo" -InternalName "Color" -DisplayName "Color" -Type Text

# ---- 2) Proyectos ----
New-ListIfMissing -Title "Proyectos"
Add-FieldIfMissing -List "Proyectos" -InternalName "Descripcion" -DisplayName "Descripcion" -Type Text
Add-FieldIfMissing -List "Proyectos" -InternalName "Color" -DisplayName "Color" -Type Text
# "Tipo" es un nombre reservado por SharePoint; se usa "TipoProyecto" en su lugar.
Add-ChoiceFieldIfMissing -List "Proyectos" -InternalName "TipoProyecto" -DisplayName "TipoProyecto" -Choices @("Recurrente", "Extraordinario")

# ---- 3) Tareas (con lookups a Equipo y Proyectos, por eso va al final) ----
New-ListIfMissing -Title "Tareas"
Add-FieldIfMissing -List "Tareas" -InternalName "Descripcion" -DisplayName "Descripcion" -Type Note
Add-ChoiceFieldIfMissing -List "Tareas" -InternalName "Prioridad" -DisplayName "Prioridad" -Choices @("Alta", "Media", "Baja")
Add-ChoiceFieldIfMissing -List "Tareas" -InternalName "Estado" -DisplayName "Estado" -Choices @("Pendiente", "En progreso", "En revisión", "Completado")
Add-FieldIfMissing -List "Tareas" -InternalName "Vencimiento" -DisplayName "Vencimiento" -Type DateTime
Add-FieldIfMissing -List "Tareas" -InternalName "RecurrenteMensual" -DisplayName "RecurrenteMensual" -Type Boolean
Add-LookupFieldIfMissing -List "Tareas" -InternalName "Responsable" -DisplayName "Responsable" -TargetListTitle "Equipo"
Add-LookupFieldIfMissing -List "Tareas" -InternalName "Proyecto" -DisplayName "Proyecto" -TargetListTitle "Proyectos"

Write-Host ""
Write-Host "Listo. Revisá en 'Contenido del sitio' que aparezcan Equipo, Proyectos y Tareas." -ForegroundColor Cyan
Write-Host "Siguiente paso: darle permiso de edición sobre estas listas a Mauricio, Agustina y Roberto." -ForegroundColor Cyan
