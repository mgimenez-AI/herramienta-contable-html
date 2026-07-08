export function seedData() {
  return {
    team: [
      { id: 'm', nombre: 'Mauricio Giménez', rol: 'Jefe de Contabilidad e Impuestos', iniciales: 'MG', color: '#00549E' },
      { id: 'a', nombre: 'Agustina Altez', rol: 'Analista Contable', iniciales: 'AA', color: '#009961' },
      { id: 'r', nombre: 'Roberto Noble', rol: 'Asistente de Contabilidad e Impuestos', iniciales: 'RN', color: '#D4A017' },
    ],
    projects: [
      { id: 'cierre', nombre: 'Cierre contable mensual', desc: 'Cierre mensual de resultados', color: '#00549E', tipo: 'recurrente' },
      { id: 'impuestos', nombre: 'Liquidación de impuestos', desc: 'IVA · Ganancias · IIBB · Retenciones', color: '#D4A017', tipo: 'recurrente' },
      { id: 'concil', nombre: 'Conciliaciones bancarias', desc: 'Bancos, caja y cuentas de balance', color: '#8DB9CA', tipo: 'recurrente' },
      { id: 'auditoria', nombre: 'Auditoría externa Q2', desc: 'Papeles de trabajo y requerimientos', color: '#009961', tipo: 'extraordinario' },
      { id: 'reporting', nombre: 'Reporting a casa matriz', desc: 'HFM · Intercompany · Package', color: '#707372', tipo: 'recurrente' },
    ],
    tasks: [
      { id: 1, title: 'Cierre contable del mes', resp: 'a', estado: 'progreso', venc: nextDate(6), proy: 'cierre', prio: 'alta', recurrente: true, desc: 'Registración y cierre de cuentas de resultado y patrimoniales del mes.' },
      { id: 2, title: 'Conciliación bancaria Banco Galicia', resp: 'r', estado: 'pendiente', venc: nextDate(4), proy: 'concil', prio: 'media', recurrente: true, desc: 'Conciliar extractos vs. mayor contable de la cuenta corriente principal.' },
      { id: 3, title: 'DDJJ IVA - Posición mensual', resp: 'm', estado: 'revision', venc: nextDate(14), proy: 'impuestos', prio: 'alta', recurrente: true, desc: 'Armado y revisión de la DDJJ de IVA. Control de crédito y débito fiscal.' },
      { id: 4, title: 'Anticipo Impuesto a las Ganancias', resp: 'a', estado: 'pendiente', venc: nextDate(11), proy: 'impuestos', prio: 'alta', recurrente: true, desc: 'Cálculo y presentación del anticipo mensual de Ganancias.' },
      { id: 5, title: 'Reporting mensual a casa matriz (HFM)', resp: 'm', estado: 'progreso', venc: nextDate(8), proy: 'reporting', prio: 'alta', recurrente: true, desc: 'Carga del package financiero mensual en HFM para consolidación.' },
      { id: 6, title: 'Papeles de trabajo auditoría', resp: 'a', estado: 'pendiente', venc: nextDate(21), proy: 'auditoria', prio: 'media', recurrente: false, desc: 'Preparación de papeles y anexos solicitados por los auditores externos.' },
      { id: 7, title: 'Conciliación de cuentas por pagar', resp: 'r', estado: 'completado', venc: nextDate(-1), proy: 'concil', prio: 'baja', recurrente: true, desc: 'Cotejo del subdiario de proveedores contra saldos contables.' },
      { id: 8, title: 'DDJJ Ingresos Brutos - Convenio Multilateral', resp: 'r', estado: 'progreso', venc: nextDate(16), proy: 'impuestos', prio: 'media', recurrente: true, desc: 'Distribución de base imponible por jurisdicción. CM05/CM03.' },
      { id: 9, title: 'Revisión de asientos de provisiones', resp: 'a', estado: 'revision', venc: nextDate(5), proy: 'cierre', prio: 'media', recurrente: false, desc: 'Control de provisiones de gastos, vacaciones y cargas sociales.' },
      { id: 10, title: 'Carga de padrones y novedades AFIP', resp: 'r', estado: 'pendiente', venc: nextDate(10), proy: 'impuestos', prio: 'baja', recurrente: true, desc: 'Actualización de padrones de retención/percepción y alícuotas.' },
      { id: 11, title: 'Reconciliación Intercompany', resp: 'm', estado: 'pendiente', venc: nextDate(12), proy: 'reporting', prio: 'media', recurrente: true, desc: 'Matcheo de saldos y transacciones con empresas vinculadas.' },
      { id: 12, title: 'Cierre de bancos y caja', resp: 'r', estado: 'completado', venc: nextDate(-2), proy: 'cierre', prio: 'media', recurrente: true, desc: 'Arqueo de caja y conciliación final de cuentas bancarias.' },
      { id: 13, title: 'Respuesta a requerimiento de auditores', resp: 'm', estado: 'progreso', venc: nextDate(7), proy: 'auditoria', prio: 'alta', recurrente: false, desc: 'Elaboración de respuestas y evidencia para la auditoría externa.' },
      { id: 14, title: 'SIRE - Retenciones y percepciones', resp: 'a', estado: 'pendiente', venc: nextDate(17), proy: 'impuestos', prio: 'media', recurrente: true, desc: 'Generación y presentación del Sistema Integral de Retenciones.' },
      { id: 15, title: 'Balance de sumas y saldos', resp: 'a', estado: 'revision', venc: nextDate(9), proy: 'cierre', prio: 'media', recurrente: true, desc: 'Emisión y revisión del balance de comprobación.' },
      { id: 16, title: 'Provisión de Impuesto Diferido', resp: 'm', estado: 'pendiente', venc: nextDate(18), proy: 'cierre', prio: 'media', recurrente: false, desc: 'Cálculo de diferencias temporarias y registración del diferido.' },
      { id: 17, title: 'Conciliación Banco Nación', resp: 'r', estado: 'progreso', venc: nextDate(0), proy: 'concil', prio: 'alta', recurrente: true, desc: 'Conciliación de la cuenta recaudadora. Partidas por regularizar.' },
    ],
  };
}

function nextDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
