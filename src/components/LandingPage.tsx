// import {HOME_COLORS} from "../config";
import "../styles/components/LandingPage.css"
import CanvasBoard from "./canvasBoard";
// import Board from "./Board";

const LandingPage = () => {
    return (
        <div className="page">
            {/* <h1>Landing Page</h1> */}
            <CanvasBoard/>
            {/* <Board colors={HOME_COLORS}/> */}
        </div>
    )
}

export default LandingPage;