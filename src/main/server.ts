import { MongoHelper } from "../infra/db/mongo/mongo-helper";

void MongoHelper.connect(
  process.env.MONGO_URL || "mongodb://localhost:27017/clean-node-api-db",
)
  .then(async () => {
    const app = (await import("./app")).default;

    app.listen(process.env.PORT || 5050, () => {
      console.log("Server running at http://localhost:5050");
    });
  })
  .catch(console.error);
