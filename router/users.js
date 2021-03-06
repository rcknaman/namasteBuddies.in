const express=require('express');
const router=express.Router();

const passport=require('passport');


const usercontroller=require('../controller/user_controller');
router.get('/fetch-notifs',usercontroller.fetchNotifs);
router.get('/delete-notifs/:id/:typeof/:postid',usercontroller.deleteNotifs);
router.get('/sessionCheck',usercontroller.sessionCheck);
router.get('/profile/:id',passport.checkAuthentication,usercontroller.profile);
router.get('/signin',usercontroller.signin);
router.get('/signup',usercontroller.signup);
router.post('/create',usercontroller.create);
router.get('/findFriends',usercontroller.findFriends);
router.post('/update',passport.checkAuthentication,usercontroller.update);
router.get('/friendAndGroups',passport.checkAuthentication,usercontroller.friendAndGroups);
router.get('/update-page',passport.checkAuthentication,usercontroller.updateProfilePage);
router.post('/create-session',passport.authenticate(
        'local',
        {failureRedirect:'/users/signin'}
),usercontroller.createSession);
router.use('/friends',require('./friends_router'));
router.get('/signout',usercontroller.destroySession);
router.use('/forgot-password',require('./forgot_password'));
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/signin'}),usercontroller.createSession);
module.exports=router;  
