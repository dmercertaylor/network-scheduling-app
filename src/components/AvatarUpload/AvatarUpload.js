import React, {useState} from 'react';
import { useTheme } from '@material-ui/core/styles';
import Avatar from 'react-avatar-edit';

export default function AvatarUpload(props){

    const [preview, setPreview] = useState(null);
    const theme = useTheme();

    const onClose = () => {
        props.onClose(preview);
        setPreview(null);
    }

    const onBeforeFileLoad = (elem) => {
        if(elem.target.files[0].size > 1048576){
            alert("Image size too large");
            elem.target.value = "";
        }
    }

    return(
        <div>
            <Avatar
                backgroundColor={theme.palette.background.paper}
                closeIconColor={theme.palette.primary.main}
                width={390}
                height={295}
                onBeforeFileLoad={onBeforeFileLoad}
                onCrop={img => setPreview(img)}
                onClose={onClose}
                src={this.state.src}
            />
            <img src={this.state.preview} alt="Preview" />
        </div>
    )
}