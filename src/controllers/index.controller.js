exports.renderIndexPage = (req, res) => {
    try {
        res.render("index");
    } catch(err) {
        console.error("| Controller | index => renderIndexPage", error); 
    }
};
