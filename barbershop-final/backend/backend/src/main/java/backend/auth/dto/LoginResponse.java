package backend.auth.dto;
public class LoginResponse {

    private String message;
    private String role;
    private String token;

    public LoginResponse(String message, String role, String token) {
        this.message = message;
        this.role = role;
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public String getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }
}