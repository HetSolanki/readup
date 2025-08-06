# 🐊 Readup CLI

**Readup** is a simple command-line RSS feed tool that lets you register users, follow/unfollow feeds, and browse the latest posts — all without leaving your terminal.

---

## 📦 Features

- **Register/Login** users
- **List registered users**
- **Follow/Unfollow** RSS feeds
- **Automatically fetch feeds** at a set interval
- **Browse posts** from followed feeds
- Lightweight and easy to use

---

## 📥 Installation

```bash
git clone https://github.com/HetSolanki/readup.git
cd readup
nvm use
npm install
```

**Note:**

- Requires [nvm](https://github.com/nvm-sh/nvm) to use the correct Node.js version from `.nvmrc`.
- Node.js v18+ recommended.

---

## 🚀 Usage

Run commands using:

```bash
npm run start <command> [options]
```

| Command                    | Description                   |
| -------------------------- | ----------------------------- |
| `register <username>`      | Register a new user           |
| `login <username>`         | Log in as a user              |
| `users`                    | List all registered users     |
| `addfeed <name> <feedUrl>` | Add feed to the databases     |
| `follow <feedUrl>`         | Follow an RSS feed            |
| `unfollow <feedUrl>`       | Unfollow an RSS feed          |
| `agg <time_between_req>`   | Start background feed fetcher |
| `browse [limit]`           | View latest posts             |
| `reset`                    | Resets database               |

---

### 1. **Register a new user**

```bash
npm run start register alice
# Output: Registered new user 'alice'
```

### 2. **Login as a user**

```bash
npm run start login alice
# Output: Logged in as 'alice'
```

### 3. **List all registered users**

```bash
npm run start users
# Output:
# alice - (current)
# bob
```

### 4. **Add new feed**

```bash
npm run start feed TechCrunch https://techcrunch.com/feed/
# Output: feed added successfully!
```

### 5. **Follow a feed**

```bash
npm run start follow https://example.com/rss
# Output: Following feed 'https://example.com/rss'
```

### 6. **Unfollow a feed**

```bash
npm run start unfollow https://example.com/rss
# Output: Unfollowed feed 'https://example.com/rss'
```

### 7. **Start the feed fetcher**

```bash
npm run start agg 5m
# Output: Fetching feeds every 60 seconds...
# Note: <time_between_req> format as follows:
#       - 5s (5 seconds)
#       - 5m - (5 minutes)
#       - 6h - (6 hour)

```

### 8. **Browse posts**

```bash
npm run start browse 5
# Output: (Shows the latest 5 posts)
```

If `limit` is not provided, 2 post as shown by default.

### 9. **Reset Database**

```bash
npm run start reset
# Output: Data Deleted Successfully!
```

---

## 📚 Example Workflow

```bash
nvm use
npm install

npm run start register het

npm run start addfeed TechCrunch https://techcrunch.com/feed/

npm run start agg 5m - (Try to run in seperate terminal.s)
npm run start browse 10

npm run start unfollow https://techcrunch.com/feed/
```

---

## ⚙️ Notes

- Feeds are stored in the database and refreshed based on your `agg` interval.
- Only the logged-in user’s followed feeds are fetched.
- Requires an internet connection for fetching feeds.
- Always run `nvm use` to match the correct Node.js version.

---

## 📝 License

MIT License © 2025 Your Het Solanki
