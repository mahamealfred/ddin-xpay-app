import React, { useState, useEffect } from "react";
import mqtt from "mqtt";

const MqttClient = () => {
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState("P35110001422"); // Change this to your desired topic

  useEffect(() => {
    // Connect to the MQTT broker
    const mqttClient = mqtt.connect("mqtt://emqx@52.36.87.202:8083"); // Replace with your broker server URL

    // Set up event listeners
    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      // Subscribe to the topic
      mqttClient.subscribe(topic);
    });

    mqttClient.on("message", (topic, message) => {
      // Handle incoming messages
      console.log(`Received message on topic ${topic}: ${message.toString()}`);
    });

    setClient(mqttClient);

    // Clean up on component unmount
    return () => {
      mqttClient.end();
    };
  }, [topic]);

  /*{
"messageType":"Mobicash",
"orderNum":"01",
"type":"Merchant payment",
"price":"360.00"
}*/
  const handlePublish = () => {
    // Publish a message to the specified topic
    if (client) {
      client.publish(topic, message);
      console.log(`Published message on topic ${topic}: ${message}`);
    }
  };

  return (
    <div>
      <h1>MQTT Client</h1>
      <label>
        Topic:
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </label>
      <br />
      <label>
        Message:
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handlePublish}>Publish</button>
    </div>
  );
};

export default MqttClient;
