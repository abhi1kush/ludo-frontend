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
		    <div className="square path"id={`${id}-cell-1`}></div>
		    <div className="square path"id={`${id}-cell-2`}></div>
		    <div className="square path"id={`${id}-cell-3`}>
                <div className="square stop">
                </div>
            </div>
		    <div className="square path"id={`${id}-cell-4`}></div>
		    <div className="square path"id={`${id}-cell-5`}></div>
		    <div className="square path"id={`${id}-cell-6`}></div>
		    <div className="victory-home-shared grey"id={`${id}-cell-7`}></div>
		    <div className="home">
			    <div className={`hori-boundry ${color}`}id={`${id}-home-edge-1`}></div>
			    <div className={`vertical-boundry ${color}`}id={`${id}-home-edge-2`}></div>
			    <div className="token-stand token-stand1"id={`${id}-ts1`}>
				    <div className={`circle ${color}`}></div>
			    </div>
		        <div className="token-stand token-stand2"id={`${id}-ts2`}>
			        <div className={`circle ${color}`}></div>
		        </div>
		        <div className={`vertical-boundry ${color}`}id={`${id}-home-edge-3`}></div>
		        <div className="token-stand token-stand3"id={`${id}-ts3`}>
			        <div className={`circle ${color}`}></div>
		        </div>
		        <div className="token-stand token-stand4"id={`${id}-ts4`}>
			        <div className={`circle ${color}`}></div>
		        </div>
		        <div className={`hori-boundry ${color}`}id={`${id}-home-edge-4`}></div> 
		    </div>
		    <div className="square path"id={`${id}-cell-8`}> </div>
		    <div className="square path"id={`${id}-cell-9`}></div>
		    <div className="square path"id={`${id}-cell-10`}></div>
		    <div className="square path"id={`${id}-cell-11`}></div>
		    <div className={`square path home_stop ${color}`}id={`${id}-cell-12`}></div>
		    <div className="square path"id={`${id}-cell-13`}></div>
		</div>
        <div className={`path-to-victory-${corner}`}>
                {(corner === 'top-left' || corner === 'top-right') && <div className="square path" id={`${id}-cell-14`}></div>}
				<div className={`square path ${color}`} id={`${id}-cell-15`}></div>
				<div className={`square path ${color}`} id={`${id}-cell-16`}></div>
				<div className={`square path ${color}`} id={`${id}-cell-17`}></div>
				<div className={`square path ${color}`} id={`${id}-cell-18`}></div>
				<div className={`square path ${color}`} id={`${id}-cell-19`}></div>
				<div className={`square path ${color}`} id={`${id}-cell-20`}></div>
				{(corner === 'bottum-left' || corner === 'bottum-right') && <div className="square path" id={`${id}-cell-21`}></div>}
		</div>
        </>
    )
}