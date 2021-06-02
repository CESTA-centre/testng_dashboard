# Foreword

This is the mock-up of a utility for exploiting the results provided by TestNG at the end of the execution of an executable test suite (ETS).

This model was created in the context of the development of ETS [ets-wms13-dgiwg-2021](https://github.com/CESTA-centre/ets-wms13-dgiwg-2021) and [ets-wmts10-dgiwg-2021](https://github.com/CESTA-centre/ets-wmts10-dgiwg-2021).

This version is therefore intended to be further developed in order to improve its stability and ergonomics, and to complete its functionalities.

# Prerequisites

To use this dashboard, you need:
- a browser to interpret html and javascript
- a _testng-result.xml_ file produced by TestNG after the execution of an ETS

# How to

Clone the repository at home `git clone https://github.com/CESTA-centre/testng_dashboard.git` and open the _index.html_ file with a browser.

Select the _testng-result.xml_ file of the ETS which results you want to interpret by clicking on the "Browse..." button.
Now you can see the summary of the ETS results.

If you wish to obtain the synthesis of several ETS at the same time, repeat the previous operation on with the _testng-results.xml_ file corresponding to the ETS to be interpreted. 
The summary of the results is added to the rest of the previous summary.

If, on the contrary, you wish to analyze the results of an ETS alone, refresh the page before selecting the _testng-results.xml_ file concerned.

# How to contribute

Many possibilities can be added to this project: add new tests contributing to the robustness of the dashboard, in particular on document parsing and analysis methods, make it applicable to ETS based on CTL by implementing new functions , improve the cosmetics and ergonomics of the page, ...

If you would like to get involved, you can:

- [Report an issue](https://github.com/CESTA-centre/testng_dashboard/issues) such as a defect or an enhancement request
- Help to resolve an [open issue](https://github.com/CESTA-centre/testng_dashboard/issues?q=is%3Aopen)
- Fix a bug: Fork the repository, apply the fix, and create a pull request
- Add new tests: Fork the repository, implement (and verify) the tests on a new topic branch, and create a pull request
