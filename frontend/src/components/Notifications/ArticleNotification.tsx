import { FC, useEffect, useState } from "react";

import DateFormatter from "../../utils/DateFormatter";
import { FaBookReader } from "react-icons/fa";
import NotificationModel from "../../models/NotificationModel";
import NotificationSkeleton from "./NotificationSkeleton";
import UserModel from "../../models/UserModel";
import { changeNotificationStatusAsRead } from "../../store/features/socketSlice";
import { getUserById } from "../../services/userService";
import { markNotificationAsRead } from "../../services/notificationService";
import { useAppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";

interface ArticleNotificationProps {
  notification: NotificationModel;
}

const ArticleNotification: FC<ArticleNotificationProps> = ({
  notification,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    if (!notification) return;
    try {
      setIsLoading(true);
      const response = await getUserById(notification.userTriggeredId);
      if (response.status !== "ok") {
        throw new Error(response.message);
      }
      setUser(response.user);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = async () => {
    try {
      const data = await markNotificationAsRead(notification.notificationId);
      if (data.status !== "ok") {
        throw new Error(data.message);
      }
      dispatch(changeNotificationStatusAsRead(notification.notificationId));
      if (notification.type === "ARTICLE_APPROVED") {
        navigate(`/articles/${notification.entityId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [notification]);

  return (
    <>
      {isLoading && <NotificationSkeleton />}
      {!isLoading && user && (
        <div
          className="flex w-full cursor-pointer items-center justify-between  gap-2 rounded-md p-2 transition-all hover:bg-blue-600 hover:text-blue-50"
          onClick={handleNotificationClick}
        >
          <div className="flex w-max grow items-center justify-start gap-4">
            <div className=" relative flex h-10 w-10 shrink-0 items-center justify-center">
              <img
                src={user?.imageUrl}
                alt="user image"
                className=" rounded-full"
              />
              <div
                className={`absolute bottom-[-4px] right-[-4px] rounded-full ${
                  notification.type === "ARTICLE_APPROVED"
                    ? "bg-green-600"
                    : "bg-red-600"
                }  p-1 text-white`}
              >
                <FaBookReader className="text-md" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-wrap text-sm">
                {user.firstName} {user.lastName}{" "}
                {notification.type === "ARTICLE_APPROVED"
                  ? " zaakceptował"
                  : " odrzucił"}{" "}
                twój artykuł
              </p>
              <p className="text-xs">
                {DateFormatter.formatDate(notification.createdAt)}
              </p>
            </div>
          </div>
          {!notification.read && (
            <div className="animate-pulse justify-self-end rounded-full bg-green-600 p-2"></div>
          )}
        </div>
      )}
    </>
  );
};

export default ArticleNotification;
