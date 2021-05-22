import React, { Fragment, useContext } from "react";
import {Avatar} from "@material-ui/core";
import {GoVerified} from "react-icons/go";
import PropTypes from "prop-types";
import { withBrowseUser } from "../HOC/withBrowseUser";
import { AppContext } from "../../Context";
import Skeleton from "react-loading-skeleton";
import FollowUnfollowBtn from "../../Components/FollowUnfollowBtn/FollowUnfollowBtn";
import { trimText } from "../../Utilities/TrimText";

const SuggestItem =(props)=>{
    const { loadingState, receivedData } = useContext(AppContext);
    const { userName, isVerified, userUid, userAvatarUrl, browseUser, creationDate, followers } = props;
    const mutuals = receivedData?.following.filter(el => el.receiverUid !== receivedData?.uid && followers?.sort((a,b) => b?.date?.seconds -  a?.date?.seconds).some(item => item?.senderUid === el?.receiverUid)).slice(0,1);
    return(
        <Fragment>
            <div className="suggest--item--container">
               {
                // SKELETON
                loadingState?.suggList ?
                <li className="suggestion--item flex-row mb-3">
                    <div className="side--user--info flex-row">
                        <Skeleton count={1} circle={true} width={32} height={32} />
                        <span className="flex-column ml-2">
                             <Skeleton count={1} width={80} height={13} />
                             <Skeleton count={1} width={150} height={13} />
                        </span>
                    </div>
                    <Skeleton count={1} width={39} height={13} />
                </li>
                :
                // LOADED CONTENT
                <li className="suggestion--item flex-row">
                    <div onClick={()=> browseUser(userUid, userName )} title={userName} className="side--user--info flex-row">
                        <Avatar src={userAvatarUrl} alt={userName} title={userName}/>
                        <span className="flex-column">
                              <h5 className="flex-row">{userName}{isVerified ?  <span><GoVerified className="verified_icon"/></span> : null} </h5>  
                            <small>{ //if account creation's date is less than 2 weeks
                            (creationDate && (new Date() - new Date(creationDate?.seconds * 1000) < 1209600000) ) ? "New to Voxgram"
                            : mutuals?.length > 0 ?
                                (<span className="flex-row trim__txt" title={mutuals[0]?.receiverName}> 
                                        {trimText(`followed by ${mutuals[0]?.receiverName}`,20)}
                                </span>)
                            : "Suggested for you"
                            }</small>
                        </span>                       
                    </div>
                    <FollowUnfollowBtn shape="tertiary" userData={{userId: userUid, uName: userName,uAvatarUrl: userAvatarUrl, isVerified: isVerified}}/>
                </li> 
               } 
            </div>
        </Fragment>
    )
}
SuggestItem.propTypes = {
    userName:PropTypes.string.isRequired,
    isVerified: PropTypes.bool.isRequired,
    userUid: PropTypes.string.isRequired,
    followers: PropTypes.array.isRequired,
    creationDate: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ])
}
export default withBrowseUser(SuggestItem);