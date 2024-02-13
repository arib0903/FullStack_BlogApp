import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";


const AboutUser = ({bio, social_links, joinedAt, className}) => {
    return(
        <div className={"md:w-[90%] md:mt-7 " + className }>
            <p className="text-xl leading-7">{bio.length ? bio: "Nothing To Read Here"}</p>

            <div className="flex gap-x-7 gap-y-w flex-wrap my-7 items-center test-dark-grey">
                {
                    Object.keys(social_links).map((key, index) => {
                        let link = social_links[key];

                        return link ? <Link to = {link} key = {key} target = "_blank"> 
                        <i className={"fi " + (key != 'website' ? "fi-brands-" + key: "fi-rr-globe" + " text-2xl hover:text-black") + " text-2xl"}></i></Link> : " "

                    })
                }
            </div>

            <p className="text-xl leading-7 text-dark-grey">Joined on {getFullDay(joinedAt)}</p>
        </div>

        )

}
export default AboutUser;