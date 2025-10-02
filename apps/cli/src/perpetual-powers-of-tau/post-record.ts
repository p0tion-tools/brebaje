export async function postRecordPerpetualPowersOfTau(githubToken?: string): Promise<void> {
  try {
    console.log(`📤 Posting contribution record to GitHub Gist...`);

    const fs = await import("fs");
    const path = await import("path");

    // Check if output directory exists
    const outputDir = "output";
    if (!fs.existsSync(outputDir)) {
      console.error(`❌ Error: Output directory does not exist: ${outputDir}`);
      console.error(`Please make a contribution first using the contribute command.`);
      process.exit(1);
    }

    // Find all record.txt files in output directory
    const files = fs.readdirSync(outputDir);
    const recordFiles = files.filter((file) => file.endsWith("_record.txt"));

    if (recordFiles.length === 0) {
      console.error(`❌ Error: No record files found in ${outputDir} directory`);
      console.error(`Please make a contribution first using the contribute command.`);
      process.exit(1);
    }

    // Check that there is exactly one record file
    if (recordFiles.length > 1) {
      console.error(`❌ Error: Multiple record files found in ${outputDir} directory`);
      console.error(`Found files: ${recordFiles.join(", ")}`);
      console.error(`Please ensure only one contribution record exists before posting.`);
      console.error(`You may need to clean up old record files.`);
      process.exit(1);
    }

    const recordFile = recordFiles[0];

    // Validate record file format
    const match = recordFile.match(/pot(\d+)_(\d+)_record\.txt/);
    if (!match) {
      console.error(`❌ Error: Invalid record file format: ${recordFile}`);
      console.error(`Expected format: pot<power>_<index>_record.txt`);
      process.exit(1);
    }

    const power = parseInt(match[1]);
    const index = parseInt(match[2]);

    const recordFilePath = path.join(outputDir, recordFile);
    console.log(`Found record file: ${recordFile}`);

    // Read the record file content
    const recordContent = fs.readFileSync(recordFilePath, "utf-8");

    // Get GitHub token from parameter, environment, or prompt user
    let token = githubToken || process.env.GITHUB_TOKEN;

    if (!token) {
      console.log(`🔑 GitHub token required to create public gist.`);
      console.log(`You can provide it by:`);
      console.log(`  1. Setting GITHUB_TOKEN environment variable`);
      console.log(`  2. Passing as command argument: --token <your-token>`);
      console.log(`  3. Create a personal access token at: https://github.com/settings/tokens`);
      console.log(`     (Select 'gist' scope for gist creation)`);
      process.exit(1);
    }

    // Create GitHub Gist using GitHub API
    console.log(`🔗 Creating public gist on GitHub...`);

    const axios = await import("axios");

    try {
      const gistData = {
        description: `Powers of Tau Contribution Record - Index ${index}`,
        public: true,
        files: {
          [recordFile]: {
            content: recordContent,
          },
        },
      };

      const response = await axios.default.post("https://api.github.com/gists", gistData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "brebaje-cli",
          Accept: "application/vnd.github.v3+json",
        },
      });

      const gistUrl = response.data.html_url;
      const gistId = response.data.id;

      console.log(`✅ Gist created successfully!`);
      console.log(`📄 Record file: ${recordFile}`);
      console.log(`🔗 Gist URL: ${gistUrl}`);
      console.log(`🆔 Gist ID: ${gistId}`);
      console.log(`📊 Contribution Index: ${index}`);
      console.log(`💡 Share this URL to verify your contribution publicly.`);

      // Generate Twitter/X sharing link
      const tweetText = `Hey! I have contributed to the Cardano Perpetual Powers of Tau Ceremony, here the public record of my contribution: ${gistUrl}

#Cardano #ZK #Catalyst`;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

      console.log(``);
      console.log(`🐦 Share on Twitter/X:`);
      console.log(`${twitterUrl}`);
      console.log(``);
      console.log(`📱 Click the link above to share your contribution on social media!`);
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Unknown error";

        if (status === 401) {
          console.error(`❌ Authentication Error: Invalid GitHub token`);
          console.error(`Please check your token has 'gist' scope enabled`);
          console.error(`Token format: ${token.substring(0, 10)}...`);
        } else if (status === 403) {
          console.error(`❌ Permission Error: Token lacks required permissions`);
          console.error(`Please ensure your token has 'gist' scope enabled`);
        } else if (status === 404) {
          console.error(`❌ Not Found Error: Check token and permissions`);
          console.error(`This could mean:`);
          console.error(`  1. Token is invalid or expired`);
          console.error(`  2. Token doesn't have 'gist' scope`);
          console.error(`  3. Token format is incorrect`);
          console.error(`Your token starts with: ${token.substring(0, 10)}...`);
        } else {
          console.error(`❌ GitHub API Error (${status}): ${message}`);
          console.error(`Full response: ${JSON.stringify(error.response.data, null, 2)}`);
        }
      } else if (error.request) {
        console.error(`❌ Network Error: Cannot reach GitHub API`);
        console.error(`Please check your internet connection`);
      } else {
        console.error(`❌ Request Error: ${error.message}`);
      }

      console.error(`💡 You can manually create a gist at: https://gist.github.com/`);
      console.error(`   Copy the content from: ${recordFilePath}`);
      process.exit(1);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Failed to post contribution record:", errorMessage);
    process.exit(1);
  }
}
