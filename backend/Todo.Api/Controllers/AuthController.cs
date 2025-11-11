using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Todo.Api.Models;

namespace Todo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    UserManager<AppUser> users,
    SignInManager<AppUser> signIn,
    IConfiguration cfg) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AuthDto dto)
    {
        var user = new AppUser { UserName = dto.Email, Email = dto.Email };
        var result = await users.CreateAsync(user, dto.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return Ok();
    }

    [HttpPost("login")]
    public async Task<ActionResult<TokenDto>> Login([FromBody] AuthDto dto)
    {
        var user = await users.FindByEmailAsync(dto.Email);
        if (user is null) return Unauthorized();

        var ok = await users.CheckPasswordAsync(user, dto.Password);
        if (!ok) return Unauthorized();

        var jwt = CreateJwt(user);
        return new TokenDto(jwt);
    }

    private string CreateJwt(AppUser user)
    {
        var issuer = cfg["Jwt:Issuer"];
        var audience = cfg["Jwt:Audience"];
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(cfg["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim> {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(ClaimTypes.NameIdentifier, user.Id), 
            new(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new(ClaimTypes.Name, user.UserName ?? "")
        };

        var jwt = new JwtSecurityToken(issuer, audience, claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }

    public record AuthDto(string Email, string Password);
    public record TokenDto(string token);
}
