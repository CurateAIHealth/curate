import clientPromise from "./db";

type Listener = (data: any) => void;

const listeners = new Set<Listener>();

let started = false;

export function subscribe(listener: Listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

async function startWatcher() {
  if (started) return;

  started = true;

  const client = await clientPromise;
  const db = client.db("YOUR_DATABASE_NAME"); // <-- Replace

  const collections = [
    {
      name: "Registration",
      refreshType: "registeredUsers",
    },
    {
      name: "CompliteRegistrationInformation",
      refreshType: "fullInfo",
    },
    {
      name: "Deployment",
      refreshType: "deployment",
    },
  ];

  collections.forEach(({ name, refreshType }) => {
    db.collection(name)
      .watch([], {
        fullDocument: "updateLookup",
      })
      .on("change", (change) => {
        console.log(
          `Mongo Changed -> ${name}`,
          change.operationType
        );

        listeners.forEach((listener) =>
          listener({
            collection: refreshType,
            operation: change.operationType,
          })
        );
      });
  });

  console.log("✅ Mongo Watcher Started");
}

startWatcher();