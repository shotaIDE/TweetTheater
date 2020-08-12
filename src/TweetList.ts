import { Tweet } from "./TweetCardList";

export const getTweetList = (fetchedList): Tweet[] => {
  return fetchedList.map(
    (video): Tweet => {
      const tweet: Tweet = {
        userName: video.user_name,
        userDisplayName: video.user_name,
        userProfileImageUrl: video.user_profile_image_url,
        detailUrl: video.detail_url,
        text: video.text,
        createdAt: video.created_at,
        videoUrl: video.video_url,
      };

      return tweet;
    }
  );
};
