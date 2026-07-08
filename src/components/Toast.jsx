export function Toast({ logic }) {
  const { flash } = logic;
  if (!flash) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 26,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#26302E',
        color: '#fff',
        padding: '12px 22px',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        boxShadow: '0 12px 30px rgba(20,30,40,.3)',
        zIndex: 80,
        animation: 'toastIn .2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B7D34B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
      {flash}
    </div>
  );
}
