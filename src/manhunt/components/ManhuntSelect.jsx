import { useState } from "react";
import { useEffectAsync } from "../../reactHelper";
import { FormControl, MenuItem, Select } from "@mui/material";

const ManhuntSelect = ({
    value,
    onChange,
    endpoint,
    disabled,
    keyGetter = (item) => item.id,
    titleGetter = (item) => item.name
}) => {
    const [items, setItems] = useState();

    useEffectAsync(async () => {
        if (endpoint) {
            const response = await fetch(endpoint);
            if (response.ok) {
                setItems(await response.json());
            } else {
                throw Error(await response.text());
            }
        }
    }, []);

    if (!items)
        return null;
    return <FormControl variant="outlined"
        sx={{
            width: '180px',
            backgroundColor: '#fff',
            borderRadius: '20px',
            marginBottom: '10px',
            '& .MuiOutlinedInput-root': {
                borderRadius: '20px'
            },
            zIndex: 2
        }}><Select
            value={value ?? ""}
            onChange={onChange}
            displayEmpty
            sx={{
                backgroundColor: '#33aaff',
                color: 'white',
                background: 'radial-gradient(circle at 100px 100px, #33aaff, #000)',
                '& .MuiSelect-icon': {
                    color: 'white',
                },
                '& .Mui-disabled': {
                    color: '#D0D0D0 !important',
                    opacity: 1,
                    '-webkit-text-fill-color': '#D0D0D0 !important',
                },
            }}
            MenuProps={{
                MenuListProps: {
                    sx: {
                        backgroundColor: '#33aaff',
                        color: 'white',
                        background: 'radial-gradient(circle at 100px 100px, #33aaff, #000)'
                    }
                }
            }}
            disabled={disabled ?? false}
        >
            <MenuItem value="" disabled>
                Gerät auswählen
            </MenuItem>
            {items.map((item, index) => (
                <MenuItem key={keyGetter(item)} value={keyGetter(item)}>{titleGetter(item)}</MenuItem>
            ))}
        </Select>
    </FormControl>
}

export default ManhuntSelect;