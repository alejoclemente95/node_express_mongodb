exports.notFoundPage = (req,res,next) => {
    res.status(404);
    res.render('404', {pageTitle: 'Page not found :( fuckface', path: '/404'})   
}