export interface RobotVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  posterUrl: string;
}

export const robotVideos: RobotVideo[] = [
  {
    id: "robot-rover",
    title: "Robot Rover",
    description: "Robot penjelajah otonom bergerak di lingkungan nyata",
    videoUrl: "",
    posterUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=480&q=60",
  },
  {
    id: "robotic-arm-human",
    title: "Kolaborasi Robot & Manusia",
    description: "Lengan robotik dan tangan manusia hampir bersentuhan",
    videoUrl: "",
    posterUrl: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=480&q=60",
  },
  {
    id: "humanoid-robot",
    title: "Humanoid Robot",
    description: "Robot humanoid futuristik di laboratorium teknologi",
    videoUrl: "",
    posterUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=480&q=60",
  },
  {
    id: "drone-tech",
    title: "Teknologi Drone",
    description: "Drone terbang dengan presisi untuk berbagai aplikasi",
    videoUrl: "",
    posterUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=480&q=60",
  },
];
