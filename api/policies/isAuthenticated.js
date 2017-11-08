/**
 *  @author       ::  Preston Wang-Stosur-Bassett <preston.wang-stosur-bassett14@kzoo.edu>
 *  @date         ::  Oct 17, 2017
 *  @description  ::  This file handles what is and is not considred authenticated
*/

module.exports = function(req, res, next) {
  if(req.isSocket) {
    return next();
  } else if(req.session == undefined || (req.user == undefined && req.passport == undefined)) {
    return res.send({
      success: false,
      status: 401,
      message: 'User is not authenticated'
    });
  } else if(req.session.authenticated || req.user || req.isAuthenticated()) {
    return next();
  } else {
    console.log('There is a bit of a situation here....');
    return res.send({
      success: false,
      status: 401,
      message: 'User is not authenticated'
    });
  }
}
