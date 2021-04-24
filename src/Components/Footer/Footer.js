import React, { Fragment } from "react";
import "../../Pages/Home/Home.css";
import { IoIosArrowDown } from "react-icons/io";
const Footer = (props) => (
    <Fragment>
        <footer id="main--footer">
            <div id="userProfFooter" className="userProfile--footer auth--footer--container desktop-only">
                            <ul className="auth--footer--ul flex-row">
                                    <li>ABOUT</li>
                                    <li>HELP</li>
                                    <li>PRESS</li>
                                    <li>API</li>
                                    <li>JOBS</li>
                                    <li>PRIVACY</li>
                                    <li>TERMS</li>
                                    <li>LOCATIONS</li>
                                    <li>TOP ACCOUNTS</li>
                                    <li>HASHTAGS</li>
                                    <li>LANGUAGE</li>
                                </ul>
                                <div className="auth--copyright flex-column">
                                    <span>This app was made for personal use</span>
                                    <div className="auth--copyright--inner mt-2 flex-row">
                                        <div className="lang--selector flex-row">
                                            <select>
                                                <option disabled={true}>Select</option>
                                                <option>English</option>
                                            </select> 
                                            <IoIosArrowDown />
                                        </div>
                                        
                                        <span> &copy;2020 - {new Date().getFullYear()} Instagram clone made by Mahmoud Farargy</span>
                                    </div>
                                 
                                </div>
            </div>    
        </footer>
       
    </Fragment>
)

export default Footer;