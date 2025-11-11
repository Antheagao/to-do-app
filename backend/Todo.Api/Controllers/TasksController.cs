using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Todo.Api.Data;
using Todo.Api.Models;

namespace Todo.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TasksController(AppDbContext db, IHttpContextAccessor http) : ControllerBase
{
  private string? CurrentUserId =>
      User.FindFirstValue(ClaimTypes.NameIdentifier) ??
      User.FindFirstValue(JwtRegisteredClaimNames.Sub);

  [HttpGet]
  public async Task<ActionResult<IEnumerable<TaskItem>>> List([FromQuery] string? status, [FromQuery] int? minUrgency, [FromQuery] int? maxUrgency)
  {
    var userId = CurrentUserId;
    if (userId is null) return Unauthorized();

    var q = db.Tasks.Where(t => t.UserId == userId);
    if (status == "open") q = q.Where(t => !t.IsCompleted);
    if (status == "completed") q = q.Where(t => t.IsCompleted);
    if (minUrgency is int mi) q = q.Where(t => t.Urgency >= mi);
    if (maxUrgency is int ma) q = q.Where(t => t.Urgency <= ma);

    var list = await q.OrderBy(t => t.DueDate).ThenBy(t => t.DueTime).ToListAsync();
    return Ok(list);
  }

  [HttpGet("{id:int}")]
  public async Task<ActionResult<TaskItem>> Get(int id)
  {
    var userId = CurrentUserId;
    if (userId is null) return Unauthorized();

    var t = await db.Tasks.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
    return t is null ? NotFound() : Ok(t);
  }

  [HttpPost]
  public async Task<ActionResult<TaskItem>> Create(TaskItem item)
  {
    var userId = CurrentUserId;
    if (userId is null) return Unauthorized();

    item.Id = 0;
    item.UserId = userId;
    item.CreatedAt = item.UpdatedAt = DateTime.UtcNow;
    db.Tasks.Add(item);
    await db.SaveChangesAsync();
    return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
  }

  [HttpPut("{id:int}")]
  public async Task<IActionResult> Update(int id, TaskItem update)
  {
    var userId = CurrentUserId;
    if (userId is null) return Unauthorized();
    if (id != update.Id) return BadRequest();

    var existing = await db.Tasks.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
    if (existing is null) return NotFound();

    // update allowed fields
    existing.Title = update.Title;
    existing.Description = update.Description;
    existing.DueDate = update.DueDate;
    existing.DueTime = update.DueTime;
    existing.Urgency = update.Urgency;
    existing.IsCompleted = update.IsCompleted;
    existing.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();
    return NoContent();
  }

  [HttpPost("{id:int}/complete")]
  public async Task<IActionResult> ToggleComplete(int id)
  {
    var userId = CurrentUserId;
    if (userId is null) return Unauthorized();

    var t = await db.Tasks.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
    if (t is null) return NotFound();

    t.IsCompleted = !t.IsCompleted;
    t.UpdatedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return NoContent();
  }

  [HttpDelete("{id:int}")]
  public async Task<IActionResult> Delete(int id)
  {
    var userId = CurrentUserId;
    if (userId is null) return Unauthorized();

    var t = await db.Tasks.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
    if (t is null) return NotFound();

    db.Tasks.Remove(t);
    await db.SaveChangesAsync();
    return NoContent();
  }
}
