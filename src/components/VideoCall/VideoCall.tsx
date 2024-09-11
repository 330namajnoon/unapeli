import { forwardRef } from "react";
import * as Styles from "./styles";

export interface VideoProps {
    muted?: boolean;
    autoPlay?: boolean;
    playsInline?: boolean;
    display?: string;
}

const VideoCall = forwardRef<HTMLVideoElement, VideoProps>((props, ref) => {

    return (
        <Styles.Video ref={ref} autoPlay={props.autoPlay} playsInline={props.playsInline} muted={props.muted} display={props.display}/>
    );
});

export default VideoCall;