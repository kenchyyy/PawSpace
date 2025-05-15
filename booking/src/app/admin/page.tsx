"use server";

import HomePageTab from "@/_components/admin/HomePageTab";

export default async function HomePage() {

  return (
    <div>
      <div className="flex p-8 w-fit mx-auto gap-4">
        <HomePageTab text="Requests" notify={true} pageRedirect=""></HomePageTab>

        <HomePageTab text="Current" notify={false} pageRedirect=""></HomePageTab>

        <HomePageTab text="Transfer Request" notify={false} pageRedirect=""></HomePageTab>

        <HomePageTab text="Cancellations" notify={false} pageRedirect=""></HomePageTab>
      </div>
      <div className="flex w-fit mx-auto gap-4">

      </div>
    </div>
  );
}
