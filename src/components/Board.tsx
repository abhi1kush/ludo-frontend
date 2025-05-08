import {CORNERS} from "../config";
import type { Color, Corner} from "../types/globalTypes";
import "../styles/components/Board.css"

interface BoardProps {
    colors: Color[]
}
const Board = ({colors}: BoardProps) => {
    return (
        <div className="board">
            {colors.map((home_color, index) => (<PlayerHome color={home_color} id={"1"} corner={CORNERS[index]}/>))}
        </div>
    )
}

export default Board;
interface PlayerHomeProps {
    id: string,
    color: Color,
    corner: Corner,
}
const PlayerHome = ({ id, color, corner}:PlayerHomeProps) => {
    return (
        <>
        <div className={`player-home ${color} ${corner}`} id={`${id}`}>
		    <div className="square path"id="cell_1"></div>
		    <div className="square path"id="cell_2"></div>
		    <div className="square path"id="cell_3">
                <div className="square stop">
                </div>
            </div>
		    <div className="square path"id="cell_4"></div>
		    <div className="square path"id="cell_5"></div>
		    <div className="square path"id="cell_6"></div>
		    <div className="victory-home-shared grey"id="cell_7"></div>
		    <div className="home">
			    <div className={`hori-boundry ${color}`}id="home_edge_1"></div>
			    <div className={`vertical-boundry ${color}`}id="home_edge_2"></div>
			    <div className="token-stand token-stand1"id="ts3">
				    <div className={`circle ${color}`}></div>
			    </div>
		        <div className="token-stand token-stand2"id="ts4">
			        <div className={`circle ${color}`}></div>
		        </div>
		        <div className={`vertical-boundry ${color}`}id="home_edge_5"></div>
		        <div className="token-stand token-stand3"id="ts6">
			        <div className={`circle ${color}`}></div>
		        </div>
		        <div className="token-stand token-stand4"id="ts7">
			        <div className={`circle ${color}`}></div>
		        </div>
		        <div className={`hori-boundry ${color}`}id="home_edge_8"></div> 
		    </div>
		    <div className="square path"id="cell_8"> </div>
		    <div className="square path"id="cell_9"></div>
		    <div className="square path"id="cell_10"></div>
		    <div className="square path"id="cell_11"></div>
		    <div className={`square path home_stop ${color}`}id="cell_12"></div>
		    <div className="square path"id="cell_13"></div>
		</div>
        <div className={`path-to-victory-${corner}`}>
                {(corner === 'top-left' || corner === 'top-right') && <div className="square path"></div>}
				<div className={`square path ${color}`}></div>
				<div className={`square path ${color}`}></div>
				<div className={`square path ${color}`}></div>
				<div className={`square path ${color}`}></div>
				<div className={`square path ${color}`}></div>
				<div className={`square path ${color}`}></div>
				{(corner === 'bottum-left' || corner === 'bottum-right') && <div className="square path"></div>}
		</div>
        </>
    )
}