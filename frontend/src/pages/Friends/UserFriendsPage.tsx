import {
  NotificationStatus,
  addNotification,
} from "../../store/features/notificationSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useEffect, useState } from "react";

import DeleteFriendElement from "../../components/Friends/DeleteFriendElement";
import NoContent from "../../ui/NoContent";
import UserModel from "../../models/UserModel";
import { getUserFriends } from "../../services/friendService";
import handleError from "../../services/errorHandler";

const UserFriendsPage = () => {
  const dispatch = useAppDispatch();
  const [friends, setFriends] = useState<UserModel[]>([]);
  const { userId } = useAppSelector((state) => state.user);

  const getFriends = async () => {
    try {
      const response = await getUserFriends(userId);
      if (response.status !== "ok") {
        throw new Error(response.message);
      }
      setFriends(response.friends);
    } catch (error) {
      const newError = handleError(error);
      dispatch(
        addNotification({
          message: newError.message,
          type: NotificationStatus.ERROR,
        })
      );
    }
  };

  const deleteFriendFromList = async (friendId: number) => {
    setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <div className="text-primaryDark dark:text-blue-50  flex flex-col gap-6">
      {friends.map((friend) => (
        <DeleteFriendElement
          key={friend.id}
          user={friend}
          deleteUserFromList={deleteFriendFromList}
        />
      ))}
      {friends.length === 0 && (
        <NoContent>Brak znajomych do wyświetlenia</NoContent>
      )}
    </div>
  );
};

export default UserFriendsPage;
