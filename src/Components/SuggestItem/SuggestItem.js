import React, {Fragment, useContext} from "react";
import {Avatar} from "@material-ui/core";
import {GoVerified} from "react-icons/go";
import PropTypes from "prop-types";
import { withBrowseUser } from "../HOC/withBrowseUser";
import { AppContext } from "../../Context";
import Skeleton from "react-loading-skeleton";

const SuggestItem =(props)=>{
    const { handleFollowing, receivedData, loadingState} = useContext(AppContext);
    const {userName, isVerified, userUid, userAvatarUrl, browseUser} = props;

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
                              <small>Suggested for you</small>  
                        </span>                       
                    </div>
                    <button className={receivedData?.following && receivedData?.following?.length > 0 && receivedData?.following?.some(item => item.receiverUid === userUid) ? "txt_unfollow mt-2": "txt_follow  mt-2"} color="primary" onClick={()=> handleFollowing(receivedData?.following && receivedData?.following?.length > 0 && receivedData?.following?.some(item => item?.receiverUid === userUid), userUid, userName, userAvatarUrl, receivedData?.uid, receivedData?.userName, receivedData?.userAvatarUrl)}>{receivedData?.following && receivedData?.following?.length > 0 && receivedData?.following?.some(item => item?.receiverUid === userUid) ?  "Following": "Follow"}</button>
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
}
export default withBrowseUser(SuggestItem);