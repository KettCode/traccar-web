import AutorenewIcon from '@mui/icons-material/Autorenew';

const RotateButton = ({
    onClick
}) => {
    return <div
        style={{
            position: "absolute",
            bottom: '20px',
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
        <AutorenewIcon
            style={{
                color: 'white',
                fontSize: '24px',
            }}
        />
    </div>
}

export default RotateButton