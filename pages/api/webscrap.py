import json
import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# --- Helper Function: Convert Nepali Numerals ---
def convert_nepali_to_english(nepali_str):
    nepali_map = {
        '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
        '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
    }
    clean_str = nepali_str.replace(',', '').strip()
    english_str = ''.join(nepali_map.get(char, char) for char in clean_str)
    try:
        return int(english_str)
    except ValueError:
        return 0

def scrape_fptp_summary():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    try:
        # The FPTP Summary URL
        url = "https://result.election.gov.np/FPTPWLChartResult2082.aspx"
        print(f"Loading URL: {url}")
        driver.get(url)

        # Wait for the table or specific summary element to load
        # Usually, the summary is in a table with a specific ID or class
        print("Waiting for data to render...")
        wait = WebDriverWait(driver, 20)
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "table"))) 

        soup = BeautifulSoup(driver.page_source, "html.parser")
        
        fptp_data = []
        # Target the rows in the results table
        # You may need to adjust this selector based on the exact table class
        rows = soup.find_all("div", class_="chart-result-row") # Skip header row
        print(f"Found {len(rows)} rows for parties")

        for row in rows:
            party_div = row.find("div", class_="result-label")
            party_name = party_div.get_text(strip=True) if party_div else "Unknown"

            # Extract Vote Count
            counts = row.find_all("div", class_="prog-count")

            # The first one is 'Won', the second one is 'Leading'
            raw_won = counts[0].get_text(strip=True) if len(counts) > 0 else "0"
            raw_leading = counts[1].get_text(strip=True) if len(counts) > 1 else "0"

            # 3. Convert Nepali numerals to English integers
            won_int = convert_nepali_to_english(raw_won)
            leading_int = convert_nepali_to_english(raw_leading)

            fptp_data.append({
                "Party": party_name,
                "Won": won_int,
                "Leading": leading_int
            })

        script_dir = os.path.dirname(os.path.abspath(__file__))

        # Navigate to the public folder (up two levels from pages/api)
        output_path = os.path.join(script_dir, "../../public/fptp_results.json")
        
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(fptp_data, f, ensure_ascii=False, indent=4)

        print(f"Success! Scraped {len(fptp_data)} parties for FPTP.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        driver.quit()

def scrape_election_data():
    # 1. Setup Chrome Options (Headless = No GUI)
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in background
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    # This User-Agent makes the server think it's a real person visiting
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    print("Initializing Browser...")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    try:
        url = "https://result.election.gov.np/PRVoteChartResult2082.aspx"
        print(f"Loading URL: {url}")
        driver.get(url)

        # 2. Wait for the JavaScript to execute and load data
        # We wait up to 20 seconds for the element with class 'result-label' to appear.
        # This ensures we don't scrape the empty skeleton page.
        print("Waiting for data to render...")
        wait = WebDriverWait(driver, 20)
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "result-label")))

        # 3. Get the rendered HTML
        html_content = driver.page_source
        print("Data rendered. Parsing HTML...")

        # 4. Parse with BeautifulSoup
        soup = BeautifulSoup(html_content, "html.parser")
        
        extracted_data = []
        rows = soup.find_all("div", class_="chart-result-row")
        print(f"Found {len(rows)} rows for parties")

        for row in rows:
            # Extract Party Name
            party_div = row.find("div", class_="result-label")
            party_name = party_div.get_text(strip=True) if party_div else "Unknown"

            # Extract Vote Count
            vote_div = row.find("div", class_="prog-count")
            raw_vote_text = vote_div.get_text(strip=True) if vote_div else "0"

            # Convert
            vote_int = convert_nepali_to_english(raw_vote_text)

            extracted_data.append({
                "Party": party_name,
                "Votes": vote_int
            })

        script_dir = os.path.dirname(os.path.abspath(__file__))

        # Navigate to the public folder (up two levels from pages/api)
        output_path = os.path.join(script_dir, "../../public/live_election_results.json")

        # 5. Save to JSON
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(extracted_data, f, ensure_ascii=False, indent=4)

        print(f"Success! Scraped {len(extracted_data)} parties to 'live_election_results.json'.")

    except Exception as e:
        print(f"An error occurred: {e}")
        # If it fails, print page source to debug
        # print(driver.page_source) 

    finally:
        driver.quit()

if __name__ == "__main__":
    while True:
        print(f"--- Starting scrape at {time.ctime()} ---")
        scrape_election_data()
        scrape_fptp_summary()
        print("Waiting 2 minutes for next update...")
        time.sleep(120)