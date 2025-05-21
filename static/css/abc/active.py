from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import tempfile
import time

# Cấu hình
BASE_URL = "https://www.roblox.com/not-approved"  # Thay bằng trang web bạn muốn mở

# Danh sách tài khoản
ACCOUNTS = [
    {
        "name": "Account1",
        "cookies": [
            {"name": ".ROBLOSECURITY","value": "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_F489326D6741052E5AB25A4C010CA444851FC5EAEC0E62BE140F9496D1E5C5ACC46B5D7CCAC0C91D394B8D3A2FD56EC6051B9286CDDB0F86EF9EC9C37A12A7B0742898FCB23D4E0176730C69E36BA6235AB4F4D77372014B39AE971C2AACE59C0B46589EAEF494E21A4CF533592CC2C48B60AFAA4316512DCD032EA4BF6AFA99216FFAF49E391896837C2A373FE5FE0D5F033BA5F60C9530A4E8E09597C3A7DC4B367E052C9EA0D45C2159DC1702D4E09DE9317379B09B0984B8C004211FB47431EF217DFC36C64E52D7F464A57B4FE330276009821C12F748C4FE475AA0543F35541B5EBB477C74B1B5C7FE47C552E83341838BE00E32B67B65955D40E5EB32915FE553FEC3DBCC3DD7C4521473BC59A0387C30145294F9C3B16D84691176AB848E47DA4576109B545952D70DEB8566217B329B026E94DCC5FE4BFBA411D301F5B84D0DD92CBD371A2B218855543172FFF044A6F2FCA8F442CFD22A0F0D047E8A45396884E0776BCD1CB0DA2063787B04C2F075831A38659CFCDEADC0F6515D9C1BA21CF799FBC1A9D4BAA0C81862B07A45EAA6D432214EEB3ED2711825979B25014E7CD308C5CF83B25EB2D6200685CBC67E254DDAB010EF567E12D2E7CEB5558D0DC459AD76E8955731A28AE7EBD2426E879583095B15F627D591C64ADA4D10F8300CE4BAB97D260D0C486B6446E575E0CF80"}
        ],
        "proxy": "43.153.73.54:19851",
    }
]


def create_driver(account):
    chrome_options = Options()

    # Thiết lập profile riêng
    profile_path = os.path.join(tempfile.gettempdir(), f"chrome_profile_{account['name']}")
    chrome_options.add_argument(f"user-data-dir={profile_path}")

    # Thiết lập proxy nếu có
    if account.get('proxy'):
        chrome_options.add_argument(f"--proxy-server={account['proxy']}")

    # Ẩn thông báo automation (optional)
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)

    # Khởi tạo trình duyệt
    driver = webdriver.Chrome(options=chrome_options)
    return driver


def wait_and_click(driver, by, value, timeout=30):
    """Chờ element sẵn sàng rồi click"""
    element = WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable((by, value))
    )
    element.click()
    return element


def process_page(driver):
    """Xử lý các thao tác trên trang"""
    try:
        # 1. Chờ trang load hoàn toàn (chờ body hiển thị)
        WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )

        # 2. Click checkbox acknowledgement
        wait_and_click(driver, By.ID, "acknowledgement")
        print("Đã click checkbox acknowledgement")

        # 3. Click button enable 3D
        wait_and_click(driver, By.CSS_SELECTOR, ".enable-three-dee.btn-control.btn-primary-md.btn--width")
        print("Đã click button enable 3D")

        # Thêm thời gian chờ để quan sát
        time.sleep(3)

    except Exception as e:
        print(f"Lỗi khi xử lý trang: {str(e)}")
        # Chụp màn hình khi có lỗi
        driver.save_screenshot(f"error_{time.strftime('%Y%m%d_%H%M%S')}.png")


def main():
    drivers = []

    for account in ACCOUNTS:
        try:
            # Tạo trình duyệt mới
            driver = create_driver(account)
            drivers.append(driver)

            # Mở trang web
            driver.get(BASE_URL)
            print(f"Đã mở trình duyệt cho {account['name']}")

            # Thêm cookies nếu có
            for cookie in account.get('cookies', []):
                driver.add_cookie(cookie)

            # Làm mới để áp dụng cookie
            driver.refresh()

            # Xử lý trang
            process_page(driver)

            time.sleep(2)  # Đợi giữa các tài khoản

        except Exception as e:
            print(f"Lỗi khi mở trình duyệt {account['name']}: {str(e)}")

    input("Nhấn Enter để đóng tất cả trình duyệt...")
    for driver in drivers:
        driver.quit()


if __name__ == "__main__":
    main()

