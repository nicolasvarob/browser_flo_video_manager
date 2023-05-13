const overwriteExistingVideo = (existing_save_arr, save_obj) => {
    const saved_arr = JSON.parse(existing_save_arr);
    const saved_index = saved_arr.findIndex((i) => i.vid === save_obj.vid);
    if (saved_index < 0) {
        console.log("no saved index");
        video_arr = [...saved_arr, save_obj];
        return localStorage.setItem("nico_flo_saves", JSON.stringify(video_arr));
    } else {
        console.log("update with new");
        const updated_video_arr = [
            ...saved_arr.slice(0, saved_index),
            save_obj,
            ...saved_arr.slice(saved_index + 1),
        ];
        return localStorage.setItem(
            "nico_flo_saves",
            JSON.stringify(updated_video_arr)
        );
    }
};

const floSaveVideo = () => {
    //Toma la información del video y el tiempo para almacenarlo
    const video_id = document.location.search.match("playing=([0-9]+)")[1];
    const saved_time =
        document.getElementsByClassName("video-current-time")[0].textContent;
    const full_url = document.location.href;
    const time_of_save = new Date().toISOString();

    const save_obj = {
        vid: video_id,
        time: saved_time,
        url: full_url,
        saved: time_of_save,
    };

    //añmacena en el local storage
    let video_arr = [];
    const existing_save = localStorage.getItem("nico_flo_saves");

    if (existing_save) {
        overwriteExistingVideo(existing_save, save_obj);
    } else {
        video_arr = [save_obj];
        return localStorage.setItem("nico_flo_saves", JSON.stringify(video_arr));
    }
};

const saveVideoRealTime = () => {
    const capture_video_time_int = setInterval(() => {
        floSaveVideo();
    }, 5000);
    window.addEventListener("locationchange", function() {
        clearInterval(capture_video_time_int);
    });
};

//Main function that runs all the app logic
const floVideoManager = () => {
    const video_id = document.location.search.match("playing=([0-9]+)")[1];
    if (!video_id) return false;

    const existing_save = localStorage.getItem("nico_flo_saves");
    if (!existing_save) {
        console.log("no existe un save flograppling");
    } else {
        const saved_arr = JSON.parse(existing_save);
        const saved_index = saved_arr.find((i) => i.vid === video_id);
        if (saved_index) {
            const videoPlayer = document.querySelector("video");
            if (videoPlayer) {
                const getVideoTime = () => {
                    const video_time = saved_index.time;
                    const video_time_split = video_time.split(":"); // split it at the colons
                    const toSeconds =
                        parseInt(video_time_split[0]) * 60 * 60 +
                        parseInt(video_time_split[1]) * 60 +
                        parseInt(video_time_split[2]);
                    return toSeconds;
                };
                videoPlayer.currentTime = getVideoTime();
            } else {
                console.log("no se encuentra el video player aún");
                return false;
            }
        }
    }
    //If the video is found, it will start the save video function
    saveVideoRealTime();
};

floVideoManager();