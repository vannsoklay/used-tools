const fs = require('fs');
const path = require('path');

// Paths to your JSON files
const storageFilePath = path.join(__dirname, 'storage.json');
const productFilePath = path.join(__dirname, 'products.json');
const outputFilePath = path.join(__dirname, 'updated_product.json');

// Read the JSON files
const storageData = JSON.parse(fs.readFileSync(storageFilePath, 'utf-8'));
const productItems = JSON.parse(fs.readFileSync(productFilePath, 'utf-8'));

// Iterate over storage data and compare with product data
storageData.forEach(storageItem => {
    const storeId = storageItem.store_id;
    const fileType = storageItem.file_type;

    // Determine the file extension
    let extension;
    switch (fileType) {
        case 'image/png':
            extension = 'png';
            break;
        case 'image/jpeg':
            extension = 'jpg';
            break;
        case 'image/gif':
            extension = 'gif';
            break;
        case 'image/webp':
            extension = 'webp';
            break;
        default:
            return; // Skip unsupported file types
    }

    // Compare and update the product
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']; // Add other valid extensions as needed

    // Assuming productItems is an array of product items
    productItems.forEach(productItem => {
        if (productItem.store_id === storeId) {
            // Update the thumbnail
            if (productItem.thumbnail) {
                const thumbnailParts = productItem.thumbnail.split('.');
                const currentThumbnailExtension = thumbnailParts.length > 1 ? thumbnailParts[thumbnailParts.length - 1].toLowerCase() : '';

                // Check if the thumbnail does not have a valid extension
                if (!currentThumbnailExtension || !validExtensions.includes(currentThumbnailExtension)) {
                    // If it doesn't have a valid extension, update the thumbnail
                    productItem.thumbnail = `${productItem.thumbnail}.${extension}`;
                    console.log(`Updated thumbnail for product with store_id ${storeId}: ${productItem.thumbnail}`);
                } else {
                    console.log(`Thumbnail for product with store_id ${storeId} already has a valid extension: ${currentThumbnailExtension}`);
                }
            }

            // Update each preview in the previews array
            if (productItem.previews && Array.isArray(productItem.previews)) {
                productItem.previews = productItem.previews.map(preview => {
                    const previewParts = preview.split('.');
                    const currentPreviewExtension = previewParts.length > 1 ? previewParts[previewParts.length - 1].toLowerCase() : '';

                    // Check if the preview does not have a valid extension
                    if (!currentPreviewExtension || !validExtensions.includes(currentPreviewExtension)) {
                        // If it doesn't have a valid extension, update the preview
                        return `${preview}.${extension}`;
                    } else {
                        console.log(`Preview ${preview} already has a valid extension: ${currentPreviewExtension}`);
                        return preview; // Return the original preview if valid
                    }
                });
                console.log(`Updated previews for product with store_id ${storeId}`);
            }
        }
    });

});

// Write the updated product data back to a new JSON file
fs.writeFileSync(outputFilePath, JSON.stringify(productItems, null, 2), 'utf-8');

console.log(`Updated product data written to ${outputFilePath}`);
