import React, { useContext, Fragment, useState, useEffect } from "react";
import { AppContext } from "../../Context";
import { Avatar } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { auth } from '../../Config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { GoVerified } from "react-icons/go";
import { IoMdGrid } from "react-icons/io";
import { RiLayoutRowLine } from "react-icons/ri";
import { GiCog } from "react-icons/gi";
import { VscBookmark } from "react-icons/vsc";
import reelsIco from "../../Assets/reels.png";
import PostModal from "../../Components/DesktopPost/DesktopPost";
import * as Consts from "../../Utilities/Consts";
import emptyPostsImg from "../../Assets/6efc710a1d5a.jpg";
import appleStore from "../../Assets/get-app-apple.png";
import gpStore from "../../Assets/get-app-gp.png";
import { HiOutlinePlus } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import OptionsModal from "../../Components/Generic/OptionsModal/OptionsModal";
import ProfileItem from "../../Components/ProfileItem/ProfileItem";
import { trimText } from "../../Utilities/TrimText";

const MyProfile =(props)=>{
    const [,loading] = useAuthState(auth);
    const [profSections] = useState([
        {sectionId: "grid",title: "grid", logo: <IoMdGrid />},
        {sectionId: "stacked",title: "stacked", logo: <RiLayoutRowLine/>},
        {sectionId: "saved", title: "saved", logo: <VscBookmark />}
    ]);
    const {receivedData,changeModalState, authLogout, changeMainState, uid, getUsersProfile, currentPostIndex, modalsState, updateReelsProfile, activeProfileSection, notify, handleSavingPosts} = useContext(AppContext);
    useEffect(()=>{
        window.scrollTo(0,0);
        changeMainState("currentPage", "Profile");
        return () => {
            changeMainState("activeProfileSection", {activeIndex: 0, activeID: "grid" });
        }
    },[]);
    const openPost = (postId, _, postOwnerId) =>{
                    if(postOwnerId){
                        getUsersProfile(postOwnerId).then((data) => {
                            const postsCopy = data?.posts;
                            const postIndex = postsCopy?.map(post => post?.id).indexOf(postId);
                            if(postIndex !== -1){
                                changeMainState("currentPostIndex", { index:postIndex, id: postId });
                                if((window.innerWidth || document.documentElement.clientWidth) >= 670){
                                    const timeout = setTimeout(() => {
                                        changeModalState("post", true);
                                        window.clearTimeout(timeout);
                                    },200);
                                   
                                }else{
                                    props.history.push("/browse-post");
                                }
                            }else{
                                notify("An error occurred", "error");
                            }
                        });
                    }else{
                        notify("An error occurred", "error");
                    }
    }
    const loadReels = ({currentGroupId, currentGroupIndex, currentReelIndex, currentReelId}) => {
        updateReelsProfile(uid).then(() => {
            changeMainState("currentReel",  {groupIndex: currentGroupIndex , groupId: currentGroupId, reelIndex: currentReelIndex, reelId: currentReelId });
        });
    }
    const onLoadingFail = (postOwnerId, postId ) => {
        //automatically removes elements that have failed to load denoting they don't exist and got removed from the main source
        if(postOwnerId){
            getUsersProfile(postOwnerId).then((data) => {
                const postsCopy = data?.posts;
                const postIndex = postsCopy?.map(post => post?.id).indexOf(postId);
                if(postIndex === -1 && navigator.onLine){
                    handleSavingPosts({boolean:false,data: {id: postId}});
                }
            });
      
        }
    }
    const websiteToView = receivedData?.profileInfo?.website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0]? receivedData?.profileInfo?.website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0] : "" ;
    const HeaderBottom = (
        <>
                                        {receivedData?.profileInfo && receivedData?.profileInfo?.name &&
                                    <div className="prof--acc--name">
                                        <h1>
                                        {receivedData?.profileInfo?.name}
                                        </h1>
                                        <br />
                                    </div>
                                }
                                {
                                receivedData?.profileInfo && receivedData?.profileInfo.professionalAcc && receivedData?.profileInfo.professionalAcc.show &&
                                    <div className="prof--acc--category">
                                        <span>{receivedData.profileInfo?.professionalAcc?.category}</span>
                                        <br />
                                    </div>
                                } 
                                {
                                    receivedData?.profileInfo && receivedData?.profileInfo?.bio &&
                                    <div className="bottom--row--user-info flex-column">
                                        <span>{receivedData?.profileInfo?.bio}</span>
                                    </div>
                                }
                                {
                                     receivedData?.profileInfo && receivedData?.profileInfo?.website &&
                                    <div className="prof--acc--website">
                                        <a rel="noopener noreferrer" target="_blank" href={receivedData?.profileInfo?.website}>{websiteToView}</a>
                                    </div>
                                }
        </>
    )
     return(
        <Fragment>
            {/* Modals */}
            {modalsState?.post && receivedData?.posts[currentPostIndex?.index] &&
                <PostModal/>
            }
            { modalsState?.options && !modalsState?.post &&
                <OptionsModal>
                    {receivedData?.profileInfo?.registrationMethod === "email" && <span onClick={() => {changeMainState("activeOption", {activeIndex: 2, activeID: "Change_Password_or_Email"}); props.history.push("/edit-profile")}}>Change password or email</span>}
                    <span onClick={() => {changeMainState("activeOption", {activeIndex: 1, activeID: "Professional_Account"}); props.history.push("/edit-profile")}}>Account settings</span>
                    <span onClick={() => {changeMainState("activeOption", {activeIndex: receivedData?.profileInfo?.registrationMethod === "email" ? 4 : 3, activeID: "Feedback"}); props.history.push("/edit-profile")}}>Report a problem/Rate app</span>
                    <span onClick={() => {changeMainState("activeOption", {activeIndex: receivedData?.profileInfo?.registrationMethod === "email" ? 3 : 2, activeID: "Blocked_Users"}); props.history.push("/edit-profile")}}>Manage blocked accounts</span>
                    <span onClick={()=> authLogout(props.history)}>Log out</span>
                    <span>Cancel</span>
                </OptionsModal>
            }
            <section id="usersProfile" className="users--profile--container ">
                {/* Header */}
                {/* upper row */}
                
            <div className="desktop-comp">
                <div className="user--top--info flex-column">
                <header className="user-top-inner flex-row">
                        <div className="user--pic--container flex-column">
                            <Avatar loading="lazy" className="user__picture" src={receivedData?.userAvatarUrl} alt={receivedData?.userName} />
                        </div>
                    <div className="desktop--inner--info flex-column">
                            <div className="users--action--row w-100 flex-row">
                                <h5 className="profile__display__name">{trimText(receivedData?.userName, 24)}
                               {
                                   receivedData?.isVerified ?
                                   <GoVerified className="verified_icon"/>
                                   : null
                               }
                                </h5>
                                <div className="flex-row">
                                <Link role="button" className="profile__btn prof__btn__unfollowed mr-2" to="/edit-profile" onClick={()=> changeMainState("activeOption", {activeIndex: 0, activeID: "Edit_Profile"})} >Edit profile</Link>
                                <button className="mobile-only profile__btn prof__btn__unfollowed" onClick={()=> authLogout(props.history)}><FiLogOut className="mr-1" /> Log out</button>
                                <button className="my__settings__btn" onClick={() => changeModalState("options", true)}><GiCog /></button>
                                </div>
                                
                            </div>
                            <div className="desktop--social--row flex-row">
                                <p><span>{receivedData?.posts?.length.toLocaleString()}</span> {receivedData?.posts?.length >1 ? "posts": "post"}</p>
                                <p className="acc-action clickable" onClick={()=> changeModalState("users",true, receivedData?.followers, Consts.FOLLOWERS)}><span>{receivedData?.followers?.length.toLocaleString()}</span> {receivedData?.followers?.length >1 ?"followers": "follower"}</p>
                                <p className="acc-action clickable"  onClick={()=> changeModalState("users",true, receivedData?.following, Consts.FOLLOWING)}><span>{receivedData?.following?.length.toLocaleString()}</span> following</p>
                            </div>
                            {/* bottom row */}
                            <div className="desktop-only flex-column">
                               {HeaderBottom}
                            </div>

                    </div>
                    </header>
                     {/* profile info */}
                    <div className="profile--user--info mobile-only flex-column">
                            {HeaderBottom}
                    </div>          
                </div>
                <ul className="reels--ul flex-row">
                        {
                            receivedData?.reels && receivedData?.reels.length > 0 && 
                                <div className="flex-row">
                                <li className="reel--list--item">
                                    <Link to="/add-post" className="reel--bubble reels--new flex-column">
                                    <div className="reel--upper--container flex-column">
                                            <div className="reel--upper--inner flex-row" >
                                                <HiOutlinePlus  className="add__new__reels__ico"/>
                                            </div>
                                      </div>
                                      <span className="mt-1">New</span>
                                    </Link>
                                </li>
                                
                                {receivedData?.reels.map((reel, index) =>
                                <li key={reel?.id + index} className="reel--list--item">
                                  <Link  onClick={() => loadReels({currentGroupId: reel?.id, currentGroupIndex: index, currentReelIndex: 0, currentReelId: 0})}  to="/reels" className="reel--bubble flex-column">
                                      <div className="reel--upper--container flex-column">
                                            <div className="reel--upper--inner flex-row" >
                                                <img className="reels__icon" src={reelsIco} alt="icon"/>
                                            </div>
                                      </div>
                                      
                                     <span className="mt-1">{reel.groupName}</span>
                                   </Link>   
                                </li>
                                )}
                               </div>         
                        }
                </ul>
                      
                {/* body */}
                <div className="users--profile--stripe flex-row">
                  {
                   <div className="profile--stripe--inner flex-row">
                       {
                           profSections?.map((item, index) => {
                               return(
                                   <div key={index}>
                                      <span className="profile--section--item flex-row" style={{color: activeProfileSection?.activeIndex === index ? "#363636": "#8e8e8e", borderTop: activeProfileSection?.activeIndex === index ? "1px solid #363636" : "none"}} onClick={()=> changeMainState("activeProfileSection", {activeIndex: index, activeID: profSections[index].sectionId })} >{item.logo}<strong className="desktop-only">{profSections?.[index].title}</strong></span> 
                                   </div>
                               )
                           })
                       }
                    </div>
                } 
                    
                </div>
                {
                 activeProfileSection?.activeIndex === 0 || activeProfileSection?.activeIndex === 1 ?
                 (receivedData?.posts?.length >=1 && !loading ?
                    <div className={activeProfileSection?.activeIndex === 0 ? "users--profile--posts" : "users--profile--rowLine flex-column"}>
                        {receivedData?.posts?.map((post, index)=> ( post && <ProfileItem key={post?.id + index} post={post} openPost={openPost} index={index} />))}
                    </div>
                            : loading ?
                                (<Skeleton count={10} height={250} width={250} className="mt-4 mr-4 mx-auto"  />)
                        :
                        (
                            <div className="my-empty--posts--container flex-row">
                                <div className="my-empty--posts--img flex-row">
                                    <img loading="lazy" style={{backgroundColor: "rgba(255,255,255,0.3)"}} src={emptyPostsImg} alt="logo" />
                                </div>
                                <div className="my-empty--posts--text--container flex-column">
                                    <h2>Start capturing and sharing your moments.</h2>
                                    <p>Get the app to share your first photo or video.</p>
                                    <div onClick={() => props.history.push("/add-post")} className="my--empty--posts--get--app flex-row">
                                        <img loading="lazy" src={appleStore} alt="apple store" />
                                        <img loading="lazy" src={gpStore} alt="google store" />
                                    </div>
                                </div>
                            </div>
                        )
                    ): activeProfileSection?.activeIndex === 2 ?
                    (receivedData?.savedposts?.length >=1 && !loading ?
                        <div className="saved--posts--container">
                            <h6>Only you can see what you've saved</h6>
                            <div className="users--profile--posts" >
                               
                                {receivedData?.savedposts?.map((savedItem, index)=> ( savedItem && <ProfileItem isSavedPost={true} onLoadingFail={onLoadingFail} key={savedItem?.id + index} post={savedItem} openPost={openPost} index={index} />))}
                            </div>  
                        </div>
                            : loading ?
                                    (<Skeleton count={10} height={250} width={250} className="mt-4 mr-4 mx-auto"  />)
                            :
                            (
                                <div className="empty--card mt-5 w-100 col-lg-6 col-md-12 mx-auto">
                                    <div className="plus--icon--container flex-column">
                                        <VscBookmark />
                                    </div>
                                    <h2>Save</h2>
                                    <h4>
                                    Save photos and videos that you want to see again. No one is notified, and only you can see what you've saved.
                                    </h4>
                                    </div>
                            )
                        )
                        : <h4 className="text-center">No items found</h4>
                    }
                </div>
            </section>
            
        </Fragment>
    )
}
export default withRouter(MyProfile);