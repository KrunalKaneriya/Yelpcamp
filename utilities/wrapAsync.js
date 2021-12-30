module.exports = function wrapAsync (func) {
    return function(req,res,next) {
        func(req,res,next).catch(e => next(e));
    }
}

// module.exports = wrapAsync;

// module.exports = func => {
//     return(req,res,next) => {
//         func(req,res,next).catch(e => next(e));
//     }
// }