import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";

import { FC } from "react";

interface PostFooterProps {
  liked: boolean;
  likes: number;
  comments: number;
  toogleLikeHandler: () => void;
  toogleCommentsVisibilityHandler: () => void;
}

const PostFooter: FC<PostFooterProps> = ({
  liked,
  likes,
  comments,
  toogleLikeHandler,
  toogleCommentsVisibilityHandler,
}) => {
  return (
    <div className="px-2 sm:px-4 py-2 sm:py-4 flex gap-4 sm:gap-8 text-blue-700 dark:text-blue-200">
      <div className="flex items-center gap-2 ">
        <button
          onClick={toogleLikeHandler}
          className="active:animate-ping transition-all"
        >
          {" "}
          {liked ? <FaHeart /> : <FaRegHeart />}
        </button>
        <p className="text-sm">{likes}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={toogleCommentsVisibilityHandler}>
          {" "}
          <FaRegComment />
        </button>
        <p className="text-sm">{comments}</p>
      </div>
    </div>
  );
};

export default PostFooter;
