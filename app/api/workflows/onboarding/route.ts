import { serve } from "@upstash/workflow/nextjs";

type InitialData = {
  email: string;
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email } = context.requestPayload;

  //STEP: new sign up (send welcome email)
  await context.run("new-signup", async () => {
    await sendEmail("Welcome to the platform", email);
  });

  //STEP: waiting period (3 days)
  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  //STEP: periodic check
  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState();
    });

    //STEP: check user's state and send emails based on whether they
    // are inactive or active
    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail("Email to non-active users", email);
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail("Send newsletter to active users", email);
      });
    }

    //STEP: waiting period (1 month)
    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});

async function sendEmail(message: string, email: string) {
  // Implement email sending logic here
  console.log(`Sending ${message} email to ${email}`);
}

type UserState = "non-active" | "active";

const getUserState = async (): Promise<UserState> => {
  // Implement user state logic here
  return "non-active";
};
