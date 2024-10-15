"use client";
import React from "react";

export default function ChatUsers() {
	const chats = [
		{
			id: 1,
			name: "John Doe",
			avatar:
				"https://firebasestorage.googleapis.com/v0/b/truck-fleet.appspot.com/o/users%2FLBd1a3t0rGWB5ICNZFCbSEI3fjg1%2FprofilePicture.png?alt=media&token=925b0526-aacf-4f07-bf32-d0798e17c321",
			status: "online",
		},
		{
			id: 1,
			name: "John Doe",
			avatar:
				"https://firebasestorage.googleapis.com/v0/b/truck-fleet.appspot.com/o/users%2F0L6tXVKkt1TtpQQiNjFsCcWzOmG3%2FprofilePicture.png?alt=media&token=efa3c5d8-99cc-445e-afda-f75971f588f4",
			status: "offline",
		},
	];

	function renderStatus(status: string) {
		switch (status) {
			case "online":
				return (
					<div className="absolute right-1 bottom-0 h-2 w-2 rounded-full bg-green-500" />
				);
			case "offline":
				return (
					<div className="absolute right-1 bottom-0 h-2 w-2 rounded-full bg-gray-500" />
				);
			default:
				return null;
		}
	}

	return (
		<div>
			{chats.map((chat) => (
				<div
					key={chat.id}
					className="my-2 flex items-center space-x-2 rounded-full p-1 transition-all hover:bg-gray-700"
				>
					<div className="relative">
						<img
							src={chat.avatar}
							alt={chat.name}
							className="h-10 w-10 rounded-full"
						/>
						{renderStatus(chat.status)}
					</div>

					<div>
						<h3>{chat.name}</h3>
					</div>
				</div>
			))}
		</div>
	);
}
