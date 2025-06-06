import Avatar, { type AvatarProps } from "@mui/material/Avatar";

function stringToColor(string: string) {
	let hash = 0;
	let i: number;

	/* eslint-disable no-bitwise */
	for (i = 0; i < string.length; i += 1) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = "#";

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.slice(-2);
	}
	/* eslint-enable no-bitwise */

	return color;
}

const initials = ( name: string) => {
  const parts = name.trim().split(/\s+/);
  const initial1 = parts[0] ? parts[0][0].toUpperCase() : "";
  const initial2 = parts[1] ? parts[1][0].toUpperCase() : "";
  return `${initial1}${initial2}`;
};

function stringAvatar(name: string) {
	return {
		sx: {
			bgcolor: stringToColor(name),
		},
		children: initials(name),
	};
}

export default function BackgroundLetterAvatars({
	children,
	...props
}: AvatarProps & { children: string }) {
	return <Avatar {...stringAvatar(children)} {...props} />;
}
