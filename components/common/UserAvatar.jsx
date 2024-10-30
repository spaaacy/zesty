import Avatar from "boring-avatars";

const UserAvatar = ({ size, username, ...props }) => {
  return (
    <Avatar size={size} name={username} {...props} colors={["#678D6C", "#FC7D23", "#FA3C08", "#BD0A41", "#772A53"]} />
  );
};

export default UserAvatar;
