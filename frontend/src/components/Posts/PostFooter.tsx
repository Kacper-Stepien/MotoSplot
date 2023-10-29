import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";

import { FC } from "react";

interface PostFooterProps {
  liked: boolean;
  likes: number;
  comments: number;
}

const PostFooter: FC<PostFooterProps> = ({ liked, likes, comments }) => {
  return (
    <div className="px-4 py-4 flex gap-8 text-blue-700 dark:text-blue-200">
      <div className="flex items-center gap-2">
        <button> {liked ? <FaHeart /> : <FaRegHeart />}</button>
        <p className="text-sm">{likes}</p>
      </div>
      <div className="flex items-center gap-2">
        <button>
          {" "}
          <FaRegComment />
        </button>
        <p className="text-sm">{comments}</p>
      </div>
    </div>
  );
};

export default PostFooter;
