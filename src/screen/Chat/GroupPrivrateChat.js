// import React, { useState, useEffect } from "react";
// import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

// const ChatScreen = () => {
//   const senderId = 1053; // Current user ID (Logged-in user)
//   const receiverId = 7358; // Chat partner's ID

//   const [messages, setMessages] = useState([]);
//   const [chatText, setChatText] = useState("");

//   // Fetch chat messages from API
//   const fetchMessages = async () => {
//     try {
//       const response = await fetch(`http://154.210.160.217:8081/api/get-messages/${receiverId}/${senderId}`);
//       const data = await response.json();
//       setMessages(data?.messages?.reverse()); // Reverse to show newest messages at bottom
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   // Send a new message
//   const sendMessage = async () => {
//     if (!chatText.trim()) return; // Prevent empty messages

//     try {
//       const response = await fetch("http://154.210.160.217:8081/api/send-message", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ senderId, receiverId, chatText }),
//       });

//       if (response.ok) {
//         setChatText(""); // Clear input
//         fetchMessages(); // Refresh messages
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//     const interval = setInterval(fetchMessages, 3000); // Auto refresh every 3 seconds

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, []);

//   return (
//     <View style={styles.container}>
//       {/* Chat Messages List */}
//       <FlatList
//         data={messages}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => {
//           const isSender = item.senderId === senderId;
//           return (
//             <View style={[styles.messageContainer, isSender ? styles.senderContainer : styles.receiverContainer]}>
//               <Text style={[styles.messageText, isSender ? styles.senderText : styles.receiverText]}>
//                 {item.chatText}
//               </Text>
//             </View>
//           );
//         }}
//         inverted // Show latest messages at bottom
//       />

//       {/* Message Input Box */}
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           value={chatText}
//           onChangeText={setChatText}
//           placeholder="Type a message..."
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
//           <Text style={styles.sendText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },

//   // Message Styles
//   messageContainer: {
//     maxWidth: "75%",
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 5,
//   },
//   senderContainer: { alignSelf: "flex-end", backgroundColor: "#007AFF" },
//   receiverContainer: { alignSelf: "flex-start", backgroundColor: "#ddd" },

//   senderText: { color: "#fff", fontSize: 16 },
//   receiverText: { color: "#000", fontSize: 16 },

//   // Input Box Styles
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     backgroundColor: "#fff",
//     borderTopWidth: 1,
//     borderTopColor: "#ccc",
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 10,
//     marginRight: 10,
//   },
//   sendButton: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//   },
//   sendText: { color: "#fff", fontWeight: "bold" },
// });

// export default ChatScreen;
