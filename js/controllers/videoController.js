
import routes from "../routes";
import Video from "../models/Video"


export const home = async (req, res) => {
    try {
        const videos = await Video.find({}).sort({_id: -1});
        res.render('Home', {pageTitle: 'Home', videos});
    }
    catch (error) {
        console.log(error);
        res.render("home", {pageTitle: "Home", videos: []});
    }
};

export const search = async (req, res) => {
    const { 
        query: { term: searchingBy }
    } = req;
    let videos = [];
    try {
        videos = await Video.find({
            title: { $regex: searchingBy, $options: "i" }
        });
        console.log(videos);
    }
    catch (err) {

    }
    res.render('Search', { pageTitle: 'Seardch', searchingBy, videos });
};

export const getUpload = (req, res) => { 
    res.render('Upload', {pageTitle: 'Upload'});
};

export const postUpload = async(req, res) => {
    const {
        body: { title, description },
        file : { path } 
    } = req;
    const newVideo = await Video.create({
        fileUrl: path, 
        title,
        description,
    });
    // To do: Upload and save video
    res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {    
    const {
        params: {id}
    } = req;
    try {
        const video = await Video.findById(id);
        res.render('VideoDetail', {pageTitle: 'Video Detail', video});
    }
    catch (err) {
        res.redirect(routes.home);
    }
    
};

export const getEditVideo = async (req, res) => {
    const {
        params: {id}
    } = req;
    try {
        const video = await Video.findById(id);
        console.dir(video);
        res.render("editVideo", {pageTitle: `Edit ${video.title}`, video})
    }
    catch (err) {
        res.render(routes.home);
    }
};

export const postEditVideo = async (req, res) => {
    const {
        params: {id},
        body: {title, description}
    } = req;
    try {
        await Video.findOneAndUpdate({_id: id}, {title, description})
        res.redirect(routes.videoDetail(id));
    }
    catch(err) {
        res.redirect(routes.home);
    }
}

export const deleteVideo = async (req, res) => { 
    const {
        params: {id}
    } = req;
    try {
        await Video.findOneAndRemove({_id: id})
    }
    catch {
        
    }
    res.redirect(routes.home);
};