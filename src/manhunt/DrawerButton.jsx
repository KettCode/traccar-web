import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

const DrawerButton = ({
    title,
    onClick
}) => {
    return <div
        style={{
            position: "absolute",
            top: '20px',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1976d2',
            padding: '10px 15px',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease-in-out, background-color 0.3s ease',
        }}
        onClick={onClick}
    >
        <KeyboardDoubleArrowLeftIcon
            style={{
                color: 'white',
                marginRight: '8px',
                fontSize: '24px',
            }}
        />
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
            {title}
        </span>
    </div>
}

export default DrawerButton