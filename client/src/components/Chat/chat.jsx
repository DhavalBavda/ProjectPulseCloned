import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ChatInner from './chatInner';
import './chat.css'

const socket = io("http://localhost:4000/");

// const Chat = ({ project }) => {
//     const user = useSelector((state) => state.Auth.user)
//     const [teamData, setTeamData] = useState(null);
//     const [message, setMessage] = useState();
//     const [messages, setMessages] = useState([]);
//     const [roomId, setRoomId] = useState(project._id);
//     const [members, setMembers] = useState([]);

//     useEffect(() => {
//         axios.get(`http://localhost:4000/TeamDataById/${project.TeamId}`)
//             .then((result) => {
//                 setTeamData(result.data);
//             })
//             .catch((e) => {
//                 console.log(e);
//             })
//     }, [project]);

//     useEffect(() => {
//         if (teamData) {
//             const m = teamData.TeamMembers.map(member => member.email);
//             setMembers(m);
//         }
//     }, [teamData]);



//     useEffect(() => {

//         socket.on("connect", () => {
//             console.log("Connected to the Socket.IO server");
//         });

//         socket.emit("joinRoom", roomId);

//         socket.on("message", (msg) => {
//             setMessages((prevMessages) => [...prevMessages,msg]);
//             setMessage("");
//         })

//         return () => {
//             socket.off("message");
//         };

//     }, [roomId]);

//     const sendMessage = (e) => {
//         e.preventDefault();
//         if (message.trim()) {
//             socket.emit("message", { roomId, senderId: user.email, message });
//             setMessage("");
//         }
//     };

//     const createRoom = () => {
//         socket.emit("createRoom", roomId, members);
//         console.log(`Request to create room: ${roomId} with members: ${members}`)
//     }

//     useEffect(()=>{
//         createRoom();
//     },[project]);

//     return (
//         <div>
//             <h2>Chat Room: {roomId}</h2>
//             <div>
//                 {messages.map((msg, index) => (
//                     <p key={index}>
//                         <strong>{msg.senderId}: </strong>
//                         {msg.message}
//                     </p>
//                 ))}
//             </div>
//             <form onSubmit={sendMessage}>
//                 <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Type a message"
//                 />
//                 <button type="submit">Send</button>
//             </form>
//         </div>
//     )
// }

const Chat = ({ user }) => {

    const [ProjectsData, setProjectsData] = useState([]);
    const [showChatModal, setShowChatModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:4000/ShowProjectsByEmail/${user.email}`)
            .then(result => {
                setProjectsData(result.data);
            })
    }, [user]);


    const handleButtonClick = ((project) => {
        setShowChatModal(true);
        setSelectedProject(project);
    });

    return (
        <>
            <h1>Chat</h1>
            {/* Sidebar */}
            <div>
                <ul>
                    {ProjectsData.map((project, index) => (
                        <li key={index}>
                            <button onClick={() => handleButtonClick(project)}>{project.ProjectTitle}</button>
                        </li>
                    ))}
                </ul>
            </div>

            <br></br>
            {showChatModal && 
                <ChatInner project={selectedProject} />
            }

        </>)
}

export default Chat