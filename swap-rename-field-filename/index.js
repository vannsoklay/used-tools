const fs = require('fs');
const path = require('path');

// Path to the folder containing the files
const folderPath = './folder';

function swapFilesWithMax(folderPath) {
    // Read the directory and get all files
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return console.error('Unable to scan directory:', err);
        }

        files.forEach((file) => {
            // Extract the file extension (e.g., .jpg, .png)
            const fileExtension = path.extname(file); // Get the extension like ".jpg"
            const fileBaseName = path.basename(file, fileExtension); // Get base name without extension (e.g., "123")

            // Check if the file doesn't have "_max" and has a corresponding "_max" version
            if (!fileBaseName.includes('_max')) {
                const maxFileName = `${fileBaseName}_max${fileExtension}`; // Construct the "_max" file name with the correct extension

                // Check if the "_max" version exists in the directory
                if (files.includes(maxFileName)) {
                    const currentFilePath = path.join(folderPath, file); // Path of the current file
                    const maxFilePath = path.join(folderPath, maxFileName); // Path of the corresponding "_max" file

                    // Swap the file names by renaming them
                    const tempFilePath = path.join(folderPath, `temp_${file}`);
                    fs.rename(currentFilePath, tempFilePath, (err) => {
                        if (err) throw err;

                        fs.rename(maxFilePath, currentFilePath, (err) => {
                            if (err) throw err;

                            fs.rename(tempFilePath, maxFilePath, (err) => {
                                if (err) throw err;
                                console.log(`Swapped: ${file} with ${maxFileName}`);
                            });
                        });
                    });
                }
            }
        });
    });
}

// Call the function with the path to your folder
swapFilesWithMax(folderPath);

