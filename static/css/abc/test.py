import requests
import json
import time

# Thông tin tài khoản
client_id = "9e5f94bc-e8a4-4e73-b8be-63364c29d753"
email = "amatolundt1513@outlook.com"
password = "igmUoNW9kNQ"
refresh_token = "M.C530_SN1.0.U.-Ch67VDPH3N!FpaQeIUbT!k6iqG2wp*4YvzUsYMnjXj8EQSe7drVcDgywGgtlizlzE6Xsgqcgg!HjHAGQiBFXIRtoEPAMX!b6IxKgm4BSgvdCSYyNeF4KV19ESLd8FcrIk41S12FGneZD94b5U7lqYoxe4lf3zJSRfeVmhaL0Hm6sjuwIEZrjwYrBBC2L7hig4xu9R8rFEbGayJ4IV4RTLORXpdvcUPTITFiclCcup*NimU!QeDv3WII!oHWZfBFrbOu*Stz!BcBpGhF8bzoz2Fma2wb5OrzNFuBXyn!lEpsrsxb7TjlhDAvMImM*e5lk20Mct!ByL8nzBqGHAbGWluE3jiikr4gylXOXDHFc3F7Gio36JoYAhd!B*hiiT8B53*eatk2bYf7NpslPg74GtH2X7dSMz96Q46Zd!k9Lb1EM"

# Cấu hình OAuth2
CLIENT_ID = "9e5f94bc-e8a4-4e73-b8be-63364c29d753"
REFRESH_TOKEN = "M.C530_SN1.0.U.-Ch67VDPH3N!FpaQeIUbT!k6iqG2wp*4YvzUsYMnjXj8EQSe7drVcDgywGgtlizlzE6Xsgqcgg!HjHAGQiBFXIRtoEPAMX!b6IxKgm4BSgvdCSYyNeF4KV19ESLd8FcrIk41S12FGneZD94b5U7lqYoxe4lf3zJSRfeVmhaL0Hm6sjuwIEZrjwYrBBC2L7hig4xu9R8rFEbGayJ4IV4RTLORXpdvcUPTITFiclCcup*NimU!QeDv3WII!oHWZfBFrbOu*Stz!BcBpGhF8bzoz2Fma2wb5OrzNFuBXyn!lEpsrsxb7TjlhDAvMImM*e5lk20Mct!ByL8nzBqGHAbGWluE3jiikr4gylXOXDHFc3F7Gio36JoYAhd!B*hiiT8B53*eatk2bYf7NpslPg74GtH2X7dSMz96Q46Zd!k9Lb1EM"


def get_access_token():
    url = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
    data = {
        "client_id": CLIENT_ID,
        "refresh_token": REFRESH_TOKEN,
        "grant_type": "refresh_token",
        "scope": "Mail.Read offline_access"
    }

    response = requests.post(url, data=data)
    response_data = response.json()

    if "access_token" not in response_data:
        error_msg = response_data.get("error_description", "Unknown error")
        raise Exception(f"Lỗi khi lấy token: {error_msg}")

    return response_data["access_token"]


try:
    token = get_access_token()
    print("Access Token nhận được thành công!")

    # Gọi API Outlook
    headers = {"Authorization": f"Bearer {token}"}
    emails = requests.get(
        "https://graph.microsoft.com/v1.0/me/messages",
        headers=headers
    ).json()

    print(f"Tìm thấy {len(emails.get('value', []))} email")

except Exception as e:
    print(f"LỖI: {str(e)}")