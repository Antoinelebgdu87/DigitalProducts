import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// Utility to repair comments that don't have avatarUrl
export const repairCommentsAvatars = async () => {
  try {
    console.log("🔧 Starting comment repair process...");

    // Get all comments
    const commentsSnapshot = await getDocs(collection(db, "comments"));
    console.log(`📊 Found ${commentsSnapshot.size} comments to check`);

    let repairedCount = 0;

    for (const commentDoc of commentsSnapshot.docs) {
      const commentData = commentDoc.data();

      // If comment doesn't have an avatar but has a userId
      if (!commentData.avatarUrl && commentData.userId) {
        try {
          // Get the user data
          const userDoc = await getDoc(doc(db, "users", commentData.userId));

          if (userDoc.exists()) {
            const userData = userDoc.data();

            // If user has an avatar, update the comment
            if (userData.avatarUrl) {
              await updateDoc(doc(db, "comments", commentDoc.id), {
                avatarUrl: userData.avatarUrl,
              });

              repairedCount++;
              console.log(
                `✅ Repaired comment ${commentDoc.id} for user ${commentData.username}`,
              );
            }
          }
        } catch (error) {
          console.error(`❌ Failed to repair comment ${commentDoc.id}:`, error);
        }
      }
    }

    console.log(`🎉 Repair complete! Fixed ${repairedCount} comments`);
    return repairedCount;
  } catch (error) {
    console.error("❌ Error during comment repair:", error);
    throw error;
  }
};
