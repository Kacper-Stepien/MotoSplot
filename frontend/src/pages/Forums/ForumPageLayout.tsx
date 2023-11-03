import ForumMenu from "../../components/Menu/ForumMenu";
import { Outlet } from "react-router-dom";

const ForumPageLayout = () => {
  return (
    <div className="px-6 py-12 flex items-start gap-32 h-full overflow-y-auto text-primaryDark2 dark:text-blue-50 ">
      <ForumMenu />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default ForumPageLayout;
