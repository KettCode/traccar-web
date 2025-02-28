import { Button, Typography } from "@mui/material";

const ManhuntButton = ({
    text,
    onClick,
    disabled
}) => {
    return <Button
        variant="contained"
        color="secondary"
        onClick={onClick}
        disabled={disabled}
        sx={{
            marginTop: '10px',
            fontSize: '14px',
            width: '120px',
            height: '45px',
            borderRadius: '25px',
            backgroundColor: '#33aaff',
            background: 'radial-gradient(circle at 100px 100px, #33aaff, #000)',
            '&:hover': {
                backgroundColor: '#0277bd',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            },
            '&:active': {
                backgroundColor: '#01579b',
                boxShadow: 'none',
            },
            '&.Mui-disabled': {
                color: '#D0D0D0',
                opacity: 1
            },
            zIndex: 2
        }}
    >
        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
            {text}
        </Typography>
    </Button>
}

export default ManhuntButton;