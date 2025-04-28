import requests
import json
from datetime import datetime, timedelta

# Thông tin xác thực OAuth2
client_id = '9e5f94bc-e8a4-4e73-b8be-63364c29d753'
refresh_token = '|M.C530_SN1.0.U.-Ch67VDPH3N!FpaQeIUbT!k6iqG2wp*4YvzUsYMnjXj8EQSe7drVcDgywGgtlizlzE6Xsgqcgg!HjHAGQiBFXIRtoEPAMX!b6IxKgm4BSgvdCSYyNeF4KV19ESLd8FcrIk41S12FGneZD94b5U7lqYoxe4lf3zJSRfeVmhaL0Hm6sjuwIEZrjwYrBBC2L7hig4xu9R8rFEbGayJ4IV4RTLORXpdvcUPTITFiclCcup*NimU!QeDv3WII!oHWZfBFrbOu*Stz!BcBpGhF8bzoz2Fma2wb5OrzNFuBXyn!lEpsrsxb7TjlhDAvMImM*e5lk20Mct!ByL8nzBqGHAbGWluE3jiikr4gylXOXDHFc3F7Gio36JoYAhd!B*hiiT8B53*eatk2bYf7NpslPg74GtH2X7dSMz96Q46Zd!k9Lb1EM'


def get_new_access_token(client_id, refresh_token):
    """Lấy access token mới bằng refresh token"""
    token_url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    data = {
        'client_id': client_id,
        'refresh_token': refresh_token,
        'grant_type': 'refresh_token',
        'scope': 'Mail.Read offline_access',
        # Thêm client_secret nếu ứng dụng của bạn là Confidential Client
        # 'client_secret': 'YOUR_CLIENT_SECRET',
        # Thêm redirect_uri nếu bạn đã sử dụng nó khi lấy refresh token ban đầu
        # 'redirect_uri': 'https://your-redirect-uri.com'
    }

    response = requests.post(token_url, headers=headers, data=data)
    response.raise_for_status()

    return response.json()['access_token']


def get_unread_emails_with_subject(access_token, subject_filter):
    """Lấy danh sách email chưa đọc với tiêu đề cụ thể"""
    endpoint = 'https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages'

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    # Tìm email chưa đọc và có tiêu đề chứa "Roblox Email Verification"
    params = {
        '$filter': f"isRead eq false and contains(subject, '{subject_filter}')",
        '$select': 'subject,receivedDateTime,from,bodyPreview',
        '$top': 100  # Giới hạn số lượng email trả về
    }

    response = requests.get(endpoint, headers=headers, params=params)
    response.raise_for_status()
    print(f"response: {response}")
    return response.json().get('value', [])


def main():
    try:
        # Lấy access token mới
        access_token = get_new_access_token(client_id, refresh_token)
        print("Đã lấy access token thành công")

        # Lấy email chưa đọc với tiêu đề cụ thể
        emails = get_unread_emails_with_subject(access_token, "Roblox Email Verification")

        if not emails:
            print("Không tìm thấy email chưa đọc nào với tiêu đề 'Roblox Email Verification'")
            return

        print(f"Tìm thấy {len(emails)} email chưa đọc:")
        for i, email in enumerate(emails, 1):
            print(f"\nEmail #{i}:")
            print(f"Tiêu đề: {email['subject']}")
            print(f"Ngày nhận: {email['receivedDateTime']}")
            print(f"Người gửi: {email['from']['emailAddress']['name']} ({email['from']['emailAddress']['address']})")
            print(f"Xem trước nội dung: {email['bodyPreview'][:100]}...")  # Hiển thị 100 ký tự đầu

    except requests.exceptions.HTTPError as err:
        print(f"Lỗi HTTP: {err}")
        print(f"Chi tiết lỗi: {err.response.text}")
    except Exception as err:
        print(f"Lỗi: {err}")


if __name__ == '__main__':
    main()