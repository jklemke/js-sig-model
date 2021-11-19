// top level namespace
var grox = grox || {};

// utility functions in the grox namespace
if (!grox.util) {grox.util = {}};

grox.util.checkForMissingPropertyOnObject = function (testValue, testProperty) {
	let returnString;
	if (testValue[testProperty] == undefined) {
		returnString = "missing property: " + testProperty;
	};
	return returnString;
}

grox.util.verifyPropertiesOnObject = function (testObject, objectName, propertyArray, failOnError) {
	let isSuccess = true;
	let errorMsg = "Not a " +  objectName;

	if (testObject == undefined) {
		isSuccess = false;
		errorMsg += "\nundefined"
	};

	if (typeof testObject == "object") {
		errorMsg += "\ntestObject properties:"
		for (let key in testObject) {
			errorMsg += "\n\t" + key;
		}
	} else {
		isSuccess = false;
		errorMsg += "\nnot an object"
	};

	if (isSuccess) {
		let missingPropertyString = "";
		for (let i = 0; i < propertyArray.length; i++) {
			testResult = this.checkForMissingPropertyOnObject(testObject, propertyArray[i]);
			if (testResult) {
				isSuccess = false;
				errorMsg += "\n" + testResult;
			};
		}
	}

	if (failOnError == "fail") {
		if (!isSuccess) {
			throw new Error(errorMsg);
		}
	}

	return isSuccess;
}


